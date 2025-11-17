const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth.middleware');
const reportCtrl = require('../controllers/report.controller');

// list daily reports (authenticated)
router.get('/', auth, reportCtrl.listReports);

// create daily report (user)
router.post('/', auth, reportCtrl.createReport);

module.exports = router;
