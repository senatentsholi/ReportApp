const { asyncHandler } = require('../utils/asyncHandler');
const { validateAttendance } = require('../utils/validators');
const {
  createRecord,
  deleteRecord,
  listRecords,
  updateRecord,
} = require('../services/firestoreService');

const listAttendance = asyncHandler(async (_request, response) => {
  const records = await listRecords('attendance');
  response.json({ success: true, data: records });
});

const createAttendance = asyncHandler(async (request, response) => {
  validateAttendance(request.body);
  const record = await createRecord('attendance', request.body);
  response.status(201).json({ success: true, data: record });
});

const updateAttendanceById = asyncHandler(async (request, response) => {
  const record = await updateRecord('attendance', request.params.id, request.body);
  response.json({ success: true, data: record });
});

const deleteAttendanceById = asyncHandler(async (request, response) => {
  await deleteRecord('attendance', request.params.id);
  response.json({ success: true, message: 'Attendance deleted successfully.' });
});

module.exports = {
  listAttendance,
  createAttendance,
  updateAttendanceById,
  deleteAttendanceById,
};
