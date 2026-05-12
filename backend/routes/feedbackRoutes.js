const express = require('express');
const {
  listFeedback,
  createFeedback,
  updateFeedbackById,
  deleteFeedbackById,
} = require('../controllers/feedbackController');
const { authorize, protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', authorize('prl', 'pl'), listFeedback);
router.post('/', authorize('prl', 'pl'), createFeedback);
router.put('/:id', authorize('prl', 'pl'), updateFeedbackById);
router.delete('/:id', authorize('pl'), deleteFeedbackById);

module.exports = router;
