const express = require('express');
const {
  listCourses,
  createCourse,
  updateCourseById,
  deleteCourseById,
} = require('../controllers/courseController');
const { authorize, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', listCourses);
router.post('/', authorize('pl'), createCourse);
router.put('/:id', authorize('pl'), updateCourseById);
router.delete('/:id', authorize('pl'), deleteCourseById);

module.exports = router;
