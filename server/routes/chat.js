const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

router.post('/send', auth, chatController.sendMessage);
router.get('/contacts', auth, chatController.getContacts);
router.get('/:userId', auth, chatController.getConversation);

module.exports = router;
