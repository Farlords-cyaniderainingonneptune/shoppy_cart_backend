/**
 * Middleware to check if user is authenticated via Passport/OAuth
 * Ensures request has valid session and user object from Passport
 */
export const requireOAuthUser = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized - Please login with Google first',
    });
  }

  if (!req.user || !req.user.google_id) {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Invalid OAuth session',
    });
  }

  next();
};
