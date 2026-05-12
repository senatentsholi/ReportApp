const express = require('express');
const {
  listRatings,
  createRating,
  updateRatingById,
  deleteRatingById,
} = require('../controllers/ratingController');
const { authorize, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', listRatings);
router.post('/', authorize('student', 'pl'), createRating);
router.put('/:id', authorize('student', 'pl'), updateRatingById);
router.delete('/:id', authorize('student', 'pl'), deleteRatingById);

module.exports = router;
