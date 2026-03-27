const express = require('express');
const router  = express.Router();
const { getMyReservations, createReservation, updateStatut }
  = require('../controllers/reservationController');
const auth = require('../middlewares/authMiddleware');

// mes réservations (reçues + envoyées)
router.get('/', auth, getMyReservations);

// POST /api/reservations           
router.post('/', auth, createReservation);

router.put('/:id/statut', auth, updateStatut);
module.exports = router;