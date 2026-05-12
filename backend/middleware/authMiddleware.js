const { auth, db } = require('../firebase/admin');
const { ApiError } = require('../utils/ApiError');

async function protect(request, _response, next) {
  const header = request.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authorization token is required.'));
  }

  const token = header.replace('Bearer ', '');

  try {
    const decoded = await auth.verifyIdToken(token);
    const profile = await db.collection('users').doc(decoded.uid).get();
    request.user = {
      uid: decoded.uid,
      email: decoded.email,
      ...(profile.exists ? profile.data() : {}),
    };
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token.'));
  }
}

function authorize(...roles) {
  return (request, _response, next) => {
    if (!request.user?.role || !roles.includes(request.user.role)) {
      return next(new ApiError(403, 'You are not allowed to perform this action.'));
    }

    next();
  };
}

module.exports = {
  protect,
  authorize,
};
