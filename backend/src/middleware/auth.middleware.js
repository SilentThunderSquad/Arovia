'use strict';

const supabase = require('../infrastructure/supabase/client');
const { AuthorizationError } = require('../shared/utils/errors');

/**
 * authMiddleware — verifies Supabase JWT from Authorization header.
 * Sets req.user = { userId, email, role } on success.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthorizationError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new AuthorizationError('Invalid or expired token');
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.app_metadata?.role || 'user',
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
