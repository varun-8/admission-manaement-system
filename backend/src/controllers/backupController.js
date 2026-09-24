const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const mongoose = require('mongoose');

// Mongoose Models for Admission Management System
const Lead = require('../models/Lead');
const Course = require('../models/Course');
const FollowUp = require('../models/FollowUp');
const User = require('../models/User');
const Target = require('../models/Target');
const Branding = require('../models/Branding');

// Default Backup Directory
const DEFAULT_BACKUP_DIR = path.join(process.env.USERPROFILE || 'C:\\', 'Admission_CRM_Backups');
const MAX_BACKUPS_RETAINED = 30;

// User AppData directory for persistent config
const USER_DATA_DIR = process.env.APPDATA 
  ? path.join(process.env.APPDATA, 'admission-crm-desktop')
  : path.join(process.env.USERPROFILE || 'C:\\', 'Admission_CRM_Data');

if (!fs.existsSync(USER_DATA_DIR)) {
  try { fs.mkdirSync(USER_DATA_DIR, { recursive: true }); } catch (e) {}
}

const CONFIG_FILE_PATH = path.join(USER_DATA_DIR, 'backup_config.json');

const getBackupConfig = () => {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const raw = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read backup_config.json, using defaults:', e.message);
  }
  return {
    backupDir: DEFAULT_BACKUP_DIR,
    maxRetained: MAX_BACKUPS_RETAINED,
    lastAutoBackupDate: null,
  };
};

const saveBackupConfig = (config) => {
  try {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save backup_config.json:', e);
  }
};

const enforceRetentionPolicy = (targetDir, maxRetained = MAX_BACKUPS_RETAINED) => {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(targetDir)
    .filter((file) => file.startsWith('Admission_AutoBackup_') && file.endsWith('.json'))
    .map((file) => {
      const filePath = path.join(targetDir, file);
      const stat = fs.statSync(filePath);
      return {
        name: file,
        path: filePath,
        size: stat.size,
        mtime: stat.mtimeMs,
        createdAt: stat.birthtime || stat.mtime,
      };
    })
    .sort((a, b) => b.mtime - a.mtime);

  if (files.length > maxRetained) {
    const toDelete = files.slice(maxRetained);
    toDelete.forEach((f) => {
      try {
        fs.unlinkSync(f.path);
        console.log(`[Backup Retention] Deleted old backup: ${f.name}`);
      } catch (err) {
        console.error(`[Backup Retention] Failed to delete file ${f.name}:`, err);
      }
    });
  }

  return files.slice(0, maxRetained);
};

exports.getBackupConfigInfo = async (req, res) => {
  try {
    const config = getBackupConfig();
    const activeDir = config.backupDir || DEFAULT_BACKUP_DIR;
    const backupFiles = enforceRetentionPolicy(activeDir, config.maxRetained || MAX_BACKUPS_RETAINED);

    res.json({
      success: true,
      data: {
        backupDir: activeDir,
        maxRetained: config.maxRetained || MAX_BACKUPS_RETAINED,
        lastAutoBackupDate: config.lastAutoBackupDate,
        totalBackupsCount: backupFiles.length,
        backups: backupFiles.map((b) => ({
          name: b.name,
          sizeFormatted: `${(b.size / 1024).toFixed(1)} KB`,
          createdAt: b.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching backup config:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBackupConfig = async (req, res) => {
  try {
    const { backupDir } = req.body;
    if (!backupDir || typeof backupDir !== 'string' || !backupDir.trim()) {
      return res.status(400).json({ success: false, message: 'Valid backup storage path is required' });
    }

    const trimmedPath = path.resolve(backupDir.trim());
    if (!fs.existsSync(trimmedPath)) {
      fs.mkdirSync(trimmedPath, { recursive: true });
    }

    const testFile = path.join(trimmedPath, '.write_test');
    fs.writeFileSync(testFile, 'ok', 'utf8');
    fs.unlinkSync(testFile);

    const config = getBackupConfig();
    config.backupDir = trimmedPath;
    saveBackupConfig(config);

    enforceRetentionPolicy(trimmedPath, config.maxRetained || MAX_BACKUPS_RETAINED);

    res.json({
      success: true,
      message: `Backup location updated to: ${trimmedPath}`,
      data: config,
    });
  } catch (error) {
    console.error('Error updating backup config:', error);
    res.status(500).json({ success: false, message: `Cannot access backup directory: ${error.message}` });
  }
};

exports.openBackupFolder = async (req, res) => {
  try {
    const config = getBackupConfig();
    const activeDir = config.backupDir || DEFAULT_BACKUP_DIR;

    if (!fs.existsSync(activeDir)) {
      fs.mkdirSync(activeDir, { recursive: true });
    }

    const isWindows = process.platform === 'win32';
    const isMac = process.platform === 'darwin';
    const cmd = isWindows
      ? `explorer "${activeDir}"`
      : (isMac ? `open "${activeDir}"` : `xdg-open "${activeDir}"`);

    exec(cmd, (err) => {
      if (err) console.warn('Could not launch file manager:', err.message);
    });

    res.json({
      success: true,
      message: `Opened backup directory: ${activeDir}`,
      directory: activeDir,
    });
  } catch (error) {
    console.error('Error opening backup directory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.runFullBackup = async (req, res) => {
  try {
    const force = req.body.force === true;
    const config = getBackupConfig();
    const activeDir = config.backupDir || DEFAULT_BACKUP_DIR;
    const todayStr = new Date().toISOString().split('T')[0];

    if (!force && config.lastAutoBackupDate === todayStr) {
      return res.json({
        success: true,
        alreadyRanToday: true,
        message: 'Daily auto-backup already completed today.',
        lastAutoBackupDate: config.lastAutoBackupDate,
      });
    }

    if (!fs.existsSync(activeDir)) {
      fs.mkdirSync(activeDir, { recursive: true });
    }

    const [leads, courses, followups, users, targets, branding] = await Promise.all([
      Lead.find({}).lean(),
      Course.find({}).lean(),
      FollowUp.find({}).lean(),
      User.find({}, '-password').lean(),
      Target.find({}).lean(),
      Branding.find({}).lean(),
    ]);

    const now = new Date();
    const timestampStr = `${todayStr}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
    const fileName = `Admission_AutoBackup_${timestampStr}.json`;
    const fullPath = path.join(activeDir, fileName);

    const backupPayload = {
      app: 'Educational Institution Admission CRM',
      version: '1.0.0',
      backupType: force ? 'Manual Backup' : 'Daily Auto-Backup',
      createdAt: now.toISOString(),
      dateStr: todayStr,
      counts: {
        leads: leads.length,
        courses: courses.length,
        followups: followups.length,
        users: users.length,
        targets: targets.length,
      },
      data: {
        leads,
        courses,
        followups,
        users,
        targets,
        branding,
      },
    };

    fs.writeFileSync(fullPath, JSON.stringify(backupPayload, null, 2), 'utf8');

    config.lastAutoBackupDate = todayStr;
    saveBackupConfig(config);

    const remainingBackups = enforceRetentionPolicy(activeDir, config.maxRetained || MAX_BACKUPS_RETAINED);

    res.json({
      success: true,
      alreadyRanToday: false,
      message: `Full database auto-backup completed! Saved to ${fileName}`,
      fileName,
      filePath: fullPath,
      createdAt: now.toISOString(),
      counts: backupPayload.counts,
      totalBackupsRetained: remainingBackups.length,
    });
  } catch (error) {
    console.error('Error running auto backup:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.restoreBackup = async (req, res) => {
  try {
    const payload = req.body?.backupData || req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid backup data provided.' });
    }

    const sourceData = (payload.data && typeof payload.data === 'object') ? payload.data : payload;
    const leads = sourceData.leads || [];
    const courses = sourceData.courses || [];
    const followups = sourceData.followups || [];

    let restoredLeads = 0;
    if (Array.isArray(leads) && leads.length > 0) {
      for (const leadItem of leads) {
        const leadNumber = leadItem.leadNumber;
        if (!leadNumber) continue;

        delete leadItem._id;
        delete leadItem.__v;

        await Lead.findOneAndUpdate(
          { leadNumber },
          { $set: leadItem },
          { upsert: true }
        );
        restoredLeads++;
      }
    }

    res.json({
      success: true,
      message: `Admission CRM database restored successfully! Restored ${restoredLeads} lead records.`,
      counts: {
        leads: restoredLeads,
        courses: courses.length,
        followups: followups.length,
      },
    });
  } catch (error) {
    console.error('Error restoring backup:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
