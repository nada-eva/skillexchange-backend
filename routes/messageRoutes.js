const express = require('express');
const router  = express.Router();
const { getConversations, getMessages, sendMessage, getUnreadCount }
  = require('../controllers/messageController');
const auth = require('../middlewares/authMiddleware');

// Toutes les routes messages sont protégées (JWT requis)

router.get('/conversations', auth, getConversations);
router.get('/unread-count', auth, getUnreadCount);
router.get('/:userId', auth, getMessages);
router.post('/', auth, sendMessage);

module.exports = router;