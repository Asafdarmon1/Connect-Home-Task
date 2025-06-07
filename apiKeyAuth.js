// This middleware checks for an API key in the request
require('dotenv').config();

function apiKeyAuth(req, res, next) {
  const clientKey = req.headers['x-api-key']; // Get the API key from the request headers (postman / http client)
  const serverKey = process.env.API_KEY;

  if (!clientKey) {
    return res.json({
      status: 403, // 403 Forbidden
      success: false,
      message: 'Missing API key',
    });
  }

  if (clientKey !== serverKey) {
    return res.json({
      status: 401, // 401 Unauthorized
      success: false,
      message: 'Invalid API key',
    });
  }

  next();
}

module.exports = apiKeyAuth;