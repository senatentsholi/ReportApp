const { asyncHandler } = require('../utils/asyncHandler');
const { validateFeedback } = require('../utils/validators');
const {
  createRecord,
  deleteRecord,
  listRecords,
  updateRecord,
} = require('../services/firestoreService');

const listFeedback = asyncHandler(async (_request, response) => {
  const feedback = await listRecords('feedback');
  response.json({ success: true, data: feedback });
});

const createFeedback = asyncHandler(async (request, response) => {
  validateFeedback(request.body);
  const feedback = await createRecord('feedback', request.body);
  await updateRecord('reports', request.body.reportId, {
    feedback: request.body.feedback,
    feedbackBy: request.body.feedbackBy,
    feedbackRole: request.body.feedbackRole,
  });
  response.status(201).json({ success: true, data: feedback });
});

const updateFeedbackById = asyncHandler(async (request, response) => {
  const feedback = await updateRecord('feedback', request.params.id, request.body);
  if (request.body.reportId) {
    await updateRecord('reports', request.body.reportId, {
      feedback: request.body.feedback,
      feedbackBy: request.body.feedbackBy,
      feedbackRole: request.body.feedbackRole,
    });
  }
  response.json({ success: true, data: feedback });
});

const deleteFeedbackById = asyncHandler(async (request, response) => {
  await deleteRecord('feedback', request.params.id);
  response.json({ success: true, message: 'Feedback deleted successfully.' });
});

module.exports = {
  listFeedback,
  createFeedback,
  updateFeedbackById,
  deleteFeedbackById,
};
