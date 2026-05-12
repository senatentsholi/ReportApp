const { asyncHandler } = require('../utils/asyncHandler');
const { validateRating } = require('../utils/validators');
const {
  createRecord,
  deleteRecord,
  listRecords,
  updateRecord,
} = require('../services/firestoreService');

const listRatings = asyncHandler(async (_request, response) => {
  const ratings = await listRecords('ratings');
  response.json({ success: true, data: ratings });
});

const createRating = asyncHandler(async (request, response) => {
  validateRating(request.body);
  const rating = await createRecord('ratings', request.body);
  response.status(201).json({ success: true, data: rating });
});

const updateRatingById = asyncHandler(async (request, response) => {
  const rating = await updateRecord('ratings', request.params.id, request.body);
  response.json({ success: true, data: rating });
});

const deleteRatingById = asyncHandler(async (request, response) => {
  await deleteRecord('ratings', request.params.id);
  response.json({ success: true, message: 'Rating deleted successfully.' });
});

module.exports = {
  listRatings,
  createRating,
  updateRatingById,
  deleteRatingById,
};
