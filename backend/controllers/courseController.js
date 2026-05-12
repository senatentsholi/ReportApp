const { asyncHandler } = require('../utils/asyncHandler');
const { validateCourse } = require('../utils/validators');
const {
  createRecord,
  deleteRecord,
  listRecords,
  updateRecord,
} = require('../services/firestoreService');

const listCourses = asyncHandler(async (_request, response) => {
  const courses = await listRecords('courses');
  response.json({ success: true, data: courses });
});

const createCourse = asyncHandler(async (request, response) => {
  validateCourse(request.body);
  const course = await createRecord('courses', request.body);
  response.status(201).json({ success: true, data: course });
});

const updateCourseById = asyncHandler(async (request, response) => {
  const course = await updateRecord('courses', request.params.id, request.body);
  response.json({ success: true, data: course });
});

const deleteCourseById = asyncHandler(async (request, response) => {
  await deleteRecord('courses', request.params.id);
  response.json({ success: true, message: 'Course deleted successfully.' });
});

module.exports = {
  listCourses,
  createCourse,
  updateCourseById,
  deleteCourseById,
};
