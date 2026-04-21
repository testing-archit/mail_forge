const express = require('express');
const router = express.Router();
// Custom auth parsing for SSE since it might not be a standard fetch with headers in all browsers (though MailForge sends auth headers)
const requireAuth = require('../middleware/auth');
const sseController = require('../controllers/sse.controller');

router.get('/subscribe/:deviceId', requireAuth, sseController.subscribe);

module.exports = router;
