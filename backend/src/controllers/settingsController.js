const Lead = require('../models/Lead');
const FollowUp = require('../models/FollowUp');

/**
 * Wipe all admission leads and counseling follow-up logs.
 * Requires verification against DEV_KEY in .env.
 */
exports.wipeDatabase = async (req, res) => {
  try {
    const { devKey } = req.body;

    const expectedDevKey = process.env.DEV_KEY;
    if (!expectedDevKey) {
      return res.status(500).json({
        success: false,
        message: 'DEV_KEY is not configured in backend .env file.',
      });
    }

    if (!devKey || String(devKey).trim() !== String(expectedDevKey).trim()) {
      return res.status(403).json({
        success: false,
        message: 'Invalid Developer Key. Verification failed.',
      });
    }

    // 1. Delete all Lead records
    const leadDeleteResult = await Lead.deleteMany({});

    // 2. Delete all FollowUp logs
    const followupDeleteResult = await FollowUp.deleteMany({});

    console.log(`🧹 [DEV WIPE] Database wiped by developer key.`);
    console.log(`   - Admission Leads deleted: ${leadDeleteResult.deletedCount}`);
    console.log(`   - Counseling Followups deleted: ${followupDeleteResult.deletedCount}`);

    return res.status(200).json({
      success: true,
      message: 'All admission CRM records have been successfully wiped.',
      summary: {
        leadsDeleted: leadDeleteResult.deletedCount,
        followupsDeleted: followupDeleteResult.deletedCount,
      },
    });
  } catch (error) {
    console.error('Error during database wipe:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to wipe database.',
    });
  }
};
