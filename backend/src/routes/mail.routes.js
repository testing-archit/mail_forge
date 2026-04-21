const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const mailController = require('../controllers/mail.controller');

// Ingest doesn't require standard JWT, it's for internal use, but we can protect it or leave it open
router.post('/ingest', mailController.ingestMail);

router.use(requireAuth);
router.get('/inbox/:userId', mailController.getInbox);
router.get('/sent/:userId', mailController.getSentItems);
router.post('/send', mailController.sendMail);
router.get('/:id', mailController.getEmailById);
router.delete('/:id', mailController.deleteEmail);
router.patch('/:id/read', mailController.markAsRead);
router.get('/:id/verify', mailController.verifyIntegrity);

module.exports = router;
