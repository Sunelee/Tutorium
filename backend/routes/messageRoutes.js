const express = require('express');
const messagesController = require('../controllers/messageController');

const router = express.Router();

router.get('/messages', messagesController.getChatMessages);
router.post('/messages', messagesController.createMessage);
router.post('/users/:userId/conversations/:conversationId/messages', messagesController.sendMessage);
router.patch('/users/:userId/conversations/:conversationId/messages/:messageId', messagesController.updateMessage);
router.delete('/users/:userId/conversations/:conversationId/messages/:messageId', messagesController.deleteMessage);
router.post('/users/:userId/conversations/:conversationId/messages/:messageId/mark-read', messagesController.markMessageAsRead);

module.exports = router;
