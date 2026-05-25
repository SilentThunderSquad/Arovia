'use strict';

const supabase = require('../infrastructure/supabase/client');
const { AuthorizationError } = require('../shared/utils/errors');

/**
 * adminMiddleware — ensures the authenticated user has the 'admin' role.
 * Must run AFTER authMiddleware (depends on req.user).
 */
const adminMiddleware = async (req, res, next) => {
  try {
    let role = req.user?.role;

    // Fallback: If JWT says 'user', double check the database in case JWT is stale
    if (role !== 'admin' && req.user?.userId) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.userId)
        .maybeSingle();
        
      if (data?.role === 'admin') {
        role = 'admin';
      }
    }

    if (role !== 'admin') {
      throw new AuthorizationError('Access denied. Admin privileges required.', true);
    }
    
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = adminMiddleware;
