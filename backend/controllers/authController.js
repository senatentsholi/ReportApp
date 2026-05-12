const { db } = require('../firebase/admin');
const { asyncHandler } = require('../utils/asyncHandler');
const { ensureFields } = require('../utils/validators');

const getProfile = asyncHandler(async (request, response) => {
  const snapshot = await db.collection('users').doc(request.user.uid).get();

  response.json({
    success: true,
    data: {
      id: snapshot.id,
      ...snapshot.data(),
    },
  });
});

const registerProfile = asyncHandler(async (request, response) => {
  ensureFields(request.body, ['uid', 'fullName', 'email', 'role']);

  const payload = {
    uid: request.body.uid,
    fullName: request.body.fullName,
    name: request.body.fullName,
    email: request.body.email,
    role: request.body.role,
    facultyName: request.body.facultyName || '',
    department: request.body.department || '',
    streamName: request.body.streamName || '',
    className: request.body.className || '',
  };

  await db.collection('users').doc(payload.uid).set(payload, { merge: true });

  response.status(201).json({
    success: true,
    data: payload,
  });
});

module.exports = {
  getProfile,
  registerProfile,
};
