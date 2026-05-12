const { ApiError } = require('./ApiError');

function ensureFields(payload, fields) {
  const missing = fields.filter((field) => {
    const value = payload?.[field];
    return value === undefined || value === null || String(value).trim() === '';
  });

  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);
  }
}

function validateReport(payload) {
  ensureFields(payload, [
    'facultyName',
    'className',
    'week',
    'date',
    'courseName',
    'courseCode',
    'lecturerId',
    'lecturerName',
    'venue',
    'time',
    'topic',
    'learningOutcomes',
    'recommendations',
  ]);
}

function validateAttendance(payload) {
  ensureFields(payload, [
    'studentId',
    'studentName',
    'classId',
    'className',
    'lecturerId',
    'date',
    'status',
  ]);
}

function validateRating(payload) {
  ensureFields(payload, ['studentId', 'lecturerId', 'lecturerName', 'courseCode', 'stars', 'comment']);
}

function validateCourse(payload) {
  ensureFields(payload, [
    'courseName',
    'courseCode',
    'facultyName',
    'streamName',
    'assignedLecturerId',
    'assignedLecturerName',
    'principalLecturerId',
    'principalLecturerName',
  ]);
}

function validateFeedback(payload) {
  ensureFields(payload, ['reportId', 'feedback', 'feedbackBy', 'feedbackRole']);
}

module.exports = {
  ensureFields,
  validateAttendance,
  validateCourse,
  validateFeedback,
  validateRating,
  validateReport,
};
