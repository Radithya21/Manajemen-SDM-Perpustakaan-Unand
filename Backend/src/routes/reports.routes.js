const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const prisma = require('../prismaClient');

// list daily reports (authenticated)
router.get('/', auth, async (req, res, next) => {
	try {
		const { userId, from, to } = req.query;
		const where = {};
		if (userId) where.userId = parseInt(userId);
		if (from || to) where.date = {};
		if (from) where.date.gte = new Date(from);
		if (to) where.date.lte = new Date(to);
		const rows = await prisma.dailyReport.findMany({ where, include: { user: true }, orderBy: { date: 'desc' } });
		res.json(rows);
	} catch (err) { next(err); }
});

module.exports = router;
