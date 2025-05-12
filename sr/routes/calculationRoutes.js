const express = require('express');
const router = express.Router();
const { calculateConveyor, getCalculationHistory, getCalculationById } = require('../controllers/calculationController');
const auth = require('../middleware/auth');

// Tính toán băng tải mới
router.post('/', auth, calculateConveyor);

// Lấy lịch sử tính toán của một dự án
router.get('/project/:projectId', auth, getCalculationHistory);

// Lấy chi tiết một bản tính toán
router.get('/:id', auth, getCalculationById);

module.exports = router;