const express = require('express');
const router  = express.Router();
const { getUserById, updateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

// seeing profil  /api/users/:id  
router.get('/:id', getUserById);

router.put('/:id', auth, updateUser);

router.delete('/:id', auth, deleteUser);

module.exports = router;