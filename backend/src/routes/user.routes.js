const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const userController = require('../controllers/user.controller');

// All user routes require authentication
router.use(requireAuth);

router.get('/username/:username', userController.getUserByUsername);
router.get('/:id', userController.getUserById);
router.get('/:id/config', userController.getUserConfig);
router.put('/:id/config', userController.updateUserConfig);
router.delete('/:id', userController.deactivateUser);

module.exports = router;
