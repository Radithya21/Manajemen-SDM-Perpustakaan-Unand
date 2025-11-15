const express = require('express');
const router = express.Router();
const { auth, permit } = require('../middlewares/auth.middleware');
const prisma = require('../prismaClient');

// list tasks (authenticated)
router.get('/', auth, async (req, res, next) => {
	try {
		const tasks = await prisma.task.findMany({ include: { assignee: true, createdBy: true } });
		res.json(tasks);
	} catch (err) { next(err); }
});

// create task (permit TENAGA or ADMIN)
router.post('/', auth, permit('ADMIN', 'TENAGA'), async (req, res, next) => {
	try {
		const { title, description, assigneeId, dueDate } = req.body;
		const task = await prisma.task.create({ data: { title, description, assigneeId: assigneeId || null, createdById: req.user.userId, dueDate: dueDate ? new Date(dueDate) : null } });
		res.status(201).json(task);
	} catch (err) { next(err); }
});

module.exports = router;
