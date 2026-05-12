const { db } = require('../firebase/admin');
const { asyncHandler } = require('../utils/asyncHandler');
const { ensureFields } = require('../utils/validators');

const listLecturers = asyncHandler(async (_request, response) => {
  const snapshot = await db.collection('users').where('role', '==', 'lecturer').get();
  const lecturers = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  response.json({ success: true, data: lecturers });
});

const updateLecturer = asyncHandler(async (request, response) => {
  ensureFields(request.body, ['fullName', 'facultyName', 'streamName']);

  await db.collection('users').doc(request.params.id).set(
    {
      fullName: request.body.fullName,
      name: request.body.fullName,
      facultyName: request.body.facultyName,
      department: request.body.department || '',
      streamName: request.body.streamName,
      className: request.body.className || '',
    },
    { merge: true }
  );

  response.json({
    success: true,
    data: {
      id: request.params.id,
      ...request.body,
    },
  });
});

module.exports = {
  listLecturers,
  updateLecturer,
};
