// Middleware to authenticate the user by checking the token in the request headers
// This middleware function checks if the token is provided in the request headers. If the token is not provided, it returns a 403 Forbidden response. If the token is provided, it verifies the token using the jwt.verify method. If the token is invalid, it returns a 401 Unauthorized response. If the token is valid, it sets the userId in the request object and calls the next middleware function.
const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.id;
    next();
  });
};
