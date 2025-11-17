const prisma = require('../prismaClient');
const { logActivity } = require('../services/activity.service');

const createReport = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { date, content, attachments } = req.body; // attachments: [{ filename, url }]
    const d = date ? new Date(date) : new Date();
    const report = await prisma.dailyReport.create({ data: { userId, date: d, content: content || '' } });
    if (Array.isArray(attachments) && attachments.length) {
      for (const a of attachments) {
        await prisma.attachment.create({ data: { filename: a.filename, url: a.url, reportId: report.id } });
      }
    }
    logActivity(userId, 'REPORT_CREATE', { reportId: report.id }).catch?.(() => {});
    res.status(201).json(report);
  } catch (err) { next(err); }
};

const listReports = async (req, res, next) => {
  try {
    const { userId, from, to } = req.query;
    const where = {};
    if (userId) where.userId = parseInt(userId);
    if (from || to) where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
    const rows = await prisma.dailyReport.findMany({ where, include: { user: true, attachments: true }, orderBy: { date: 'desc' } });
    res.json(rows);
  } catch (err) { next(err); }
};

module.exports = { createReport, listReports };
