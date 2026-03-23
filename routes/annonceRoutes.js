//link between req/controller
const express = require('express');
const router  = express.Router();
const { getAnnonces, getAnnonceById, createAnnonce, updateAnnonce, deleteAnnonce, getAnnoncesByUser,
} = require('../controllers/annonceController');
const auth = require('../middlewares/authMiddleware');

// GET  /api/annonces          
router.get('/', getAnnonces);

// GET  /api/annonces/user/:userId 
router.get('/user/:userId', getAnnoncesByUser);

// GET  /api/annonces/:id         
router.get('/:id', getAnnonceById);

// POST /api/annonces             
router.post('/', auth, createAnnonce);

// PUT  /api/annonces/:id          
router.put('/:id', auth, updateAnnonce);

// DELETE /api/annonces/:id       
router.delete('/:id', auth, deleteAnnonce);

module.exports = router;