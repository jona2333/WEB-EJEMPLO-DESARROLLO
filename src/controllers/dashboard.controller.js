import db from '../config/db.js';
export function overview(req, res) {
  const user_id = req.user.id;
  const goalsCount = db.prepare('SELECT COUNT(*) c FROM goals WHERE user_id=?').get(user_id).c;
  const tasksOpen = db.prepare('SELECT COUNT(*) c FROM tasks WHERE user_id=? AND done=0').get(user_id).c;
  const tasksDone = db.prepare('SELECT COUNT(*) c FROM tasks WHERE user_id=? AND done=1').get(user_id).c;
  const habits = db.prepare('SELECT COUNT(*) c FROM habits WHERE user_id=?').get(user_id).c;
  const journalEntries7 = db.prepare("SELECT COUNT(*) c FROM journal_entries WHERE user_id=? AND created_at >= datetime('now','-7 day')").get(user_id).c;
  const progressAvg = db.prepare('SELECT IFNULL(AVG(progress),0) avgp FROM goals WHERE user_id=?').get(user_id).avgp;
  res.json({
    goalsCount,
    tasksOpen,
    tasksDone,
    habits,
    journalEntries7,
    progressAvg: Number(Number(progressAvg).toFixed(2))
  });
}