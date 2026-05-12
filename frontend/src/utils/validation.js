const validAttendanceStates = ['Present', 'Late', 'Absent'];
const validRiskLevels = ['Low', 'Moderate', 'High'];

function requireFields(payload, fields) {
  const missing = fields.filter((field) => {
    const value = payload?.[field];
    return value === undefined || value === null || String(value).trim() === '';
  });

  if (missing.length) {
    throw new Error(`Please complete: ${missing.join(', ')}.`);
  }
}

export function validateRegistration(payload) {
  requireFields(payload, ['fullName', 'email', 'password', 'role']);

  if (!String(payload.email).includes('@')) {
    throw new Error('Please enter a valid email address.');
  }

  if (String(payload.password).length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
}

export function validateReport(payload) {
  requireFields(payload, [
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

  if (Number(payload.studentsPresent) < 0 || Number(payload.totalStudents) <= 0) {
    throw new Error('Attendance numbers must be valid positive values.');
  }

  if (Number(payload.studentsPresent) > Number(payload.totalStudents)) {
    throw new Error('Students present cannot be greater than registered students.');
  }
}

export function validateCourse(payload) {
  requireFields(payload, [
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

export function validateClassRecord(payload) {
  requireFields(payload, [
    'className',
    'courseId',
    'courseCode',
    'courseName',
    'lectureTime',
    'venue',
  ]);

  if (Number(payload.totalRegisteredStudents) <= 0) {
    throw new Error('Total registered students must be more than zero.');
  }
}

export function validateAttendance(payload) {
  requireFields(payload, [
    'studentId',
    'studentName',
    'classId',
    'className',
    'lecturerId',
    'date',
    'status',
  ]);

  if (!validAttendanceStates.includes(payload.status)) {
    throw new Error('Attendance status must be Present, Late, or Absent.');
  }
}

export function validateRating(payload) {
  requireFields(payload, ['studentId', 'lecturerId', 'lecturerName', 'courseCode', 'comment']);

  if (Number(payload.stars) < 1 || Number(payload.stars) > 5) {
    throw new Error('Ratings must be between 1 and 5 stars.');
  }
}

export function validateMonitoring(payload) {
  requireFields(payload, ['title', 'progress', 'action', 'riskLevel', 'ownerRole']);

  if (!validRiskLevels.includes(payload.riskLevel)) {
    throw new Error('Risk level must be Low, Moderate, or High.');
  }
}

export function validateFeedback(payload) {
  requireFields(payload, ['reportId', 'feedback', 'feedbackBy', 'feedbackRole']);
}

