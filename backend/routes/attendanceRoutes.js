const express = require('express');
const {
  listAttendance,
  createAttendance,
  updateAttendanceById,
  deleteAttendanceById,
} = require('../controllers/attendanceController');
const { authorize, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', listAttendance);
router.post('/', authorize('lecturer', 'pl'), createAttendance);
router.put('/:id', authorize('lecturer', 'pl'), updateAttendanceById);
router.delete('/:id', authorize('lecturer', 'pl'), deleteAttendanceById);

module.exports = router;
