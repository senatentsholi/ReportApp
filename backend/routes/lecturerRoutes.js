const express = require('express');
const { listLecturers, updateLecturer } = require('../controllers/lecturerController');
const { authorize, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', authorize('pl', 'prl'), listLecturers);
router.put('/:id', authorize('pl'), updateLecturer);

module.exports = router;
