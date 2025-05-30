// Middleware to authenticate the user by checking the token in the request headers
// This middleware function checks if the token is provided in the request headers.
//  If the token is not provided, it returns a 403 Forbidden response. If the token is provided,
//  it verifies the token using the jwt.verify method.
//  If the token is invalid, it returns a 401 Unauthorized response. If the token is valid,
// it sets the userId in the request object and calls the next middleware function.

require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'No token provided',
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('JWT Verification Error:', err.message);
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
          error: err.message,
        });
      }

      if (!decoded || !decoded.id) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token structure',
        });
      }

      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};
