const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const prisma = require('../prismaClient');

// basic endpoints: profile and get user by id
router.get('/me', auth, async (req, res, next) => {
	try {
		const id = req.user?.userId;
		const user = await prisma.user.findUnique({ where: { id }, include: { role: true } });
		res.json(user);
	} catch (err) { next(err); }
});

router.get('/:id', auth, async (req, res, next) => {
	try {
		const id = parseInt(req.params.id);
		const user = await prisma.user.findUnique({ where: { id }, include: { role: true } });
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json(user);
	} catch (err) { next(err); }
});

module.exports = router;
