import React, { useState } from 'react';
import { 
  Cloud, 
  CloudUpload, 
  CheckCircle2, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  Lock, 
  Server, 
  Cpu, 
  HardDrive, 
  Activity,
  Sliders,
  Bell
} from 'lucide-react';

export default function SettingsView() {
  const [backupLoading, setBackupLoading] = useState(false);
  const [lastBackup, setLastBackup] = useState('2026-09-24 16:30:00 (Automated Daily)');
  const [backupSuccess, setBackupSuccess] = useState('');
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [retentionDays, setRetentionDays] = useState('30');
  const [cloudProvider, setCloudProvider] = useState('AWS S3 (us-east-1)');

  const handleRunMockBackup = () => {
    setBackupLoading(true);
    setBackupSuccess('');

    setTimeout(() => {
      setBackupLoading(false);
      const nowStr = new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastBackup(`${nowStr} (Manual Snapshot)`);
      setBackupSuccess('Cloud Backup Snapshot created successfully and encrypted with AES-256!');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Settings Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2.5 text-white">
            <Sliders className="w-6 h-6 text-blue-400 shrink-0" />
            <span className="text-white tracking-tight">System Settings & Cloud Sync</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 max-w-xl leading-relaxed font-medium">
            Manage automated cloud backups, database retention windows, API credentials, and institutional security policies.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/80 text-xs font-bold text-slate-300">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Cloud Services Online</span>
        </div>
      </div>

      {/* Cloud Backup Card Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <CloudUpload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Encrypted Cloud Backup & Disaster Recovery</h3>
              <p className="text-xs text-slate-500">Scheduled MongoDB snapshots to isolated cloud bucket storage</p>
            </div>
          </div>

          <button
            onClick={handleRunMockBackup}
            disabled={backupLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95"
          >
            {backupLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Syncing to Cloud...
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" /> Trigger Instant Backup
              </>
            )}
          </button>
        </div>

        {backupSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{backupSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" /> Last Successful Backup
            </div>
            <div className="text-sm font-extrabold text-slate-900">{lastBackup}</div>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-400" /> Storage Destination
            </div>
            <div className="text-sm font-extrabold text-slate-900">{cloudProvider}</div>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Encryption Level
            </div>
            <div className="text-sm font-extrabold text-emerald-700">AES-256 Standard</div>
          </div>
        </div>

        {/* Configuration Toggles */}
        <div className="space-y-4 border-t border-slate-100 pt-5 text-xs">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-extrabold text-slate-900">Automated Daily Cloud Sync</div>
              <div className="text-slate-500">Automatically capture system MongoDB state every night at midnight</div>
            </div>
            <input
              type="checkbox"
              checked={autoBackupEnabled}
              onChange={(e) => setAutoBackupEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-slate-100">
            <div>
              <div className="font-extrabold text-slate-900">Snapshot Retention Period</div>
              <div className="text-slate-500">Define number of days before stale backups are purged</div>
            </div>
            <select
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 font-extrabold text-slate-800 focus:outline-none focus:border-blue-600"
            >
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
              <option value="365">1 Year</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
