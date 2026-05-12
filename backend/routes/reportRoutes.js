const express = require('express');
const {
  listReports,
  createReport,
  updateReportById,
  deleteReportById,
} = require('../controllers/reportController');
const { authorize, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', listReports);
router.post('/', authorize('lecturer', 'pl'), createReport);
router.put('/:id', authorize('lecturer', 'prl', 'pl'), updateReportById);
router.delete('/:id', authorize('lecturer', 'pl'), deleteReportById);

module.exports = router;
