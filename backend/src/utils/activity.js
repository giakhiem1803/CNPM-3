import { ActivityLog } from '../models/index.js';

export async function logActivity(userId, action, details = '') {
  try { await ActivityLog.create({ userId, action, details }); }
  catch (error) { console.warn('Activity log failed:', error.message); }
}

