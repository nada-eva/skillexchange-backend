const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const connectDB  = require('./config/db');

// 1. Charger les variables .env AVANT tout le reste
dotenv.config();

// 2. Se connecter à MongoDB
connectDB();

// 3. Créer l'application Express
const app = express();

// ───────────────────────────────────────────────────
// MIDDLEWARES GLOBAUX
// Un middleware = une fonction qui s'exécute à chaque requête
// ───────────────────────────────────────────────────

// Autoriser les requêtes venant du frontend React (port 5173)
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Permettre à Express de lire le JSON dans le body des requêtes
// Exemple : req.body.email, req.body.password
app.use(express.json());

// Lire les données de formulaires HTML classiques
app.use(express.urlencoded({ extended: true }));

// ───────────────────────────────────────────────────
// ROUTES
// On les décommentera au fur et à mesure des sprints
// ───────────────────────────────────────────────────

// Route de test — vérifie que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API SkillExchange opérationnelle',
    version: '1.0.0',
    status:  'OK',
  });
});

// Sprint 2 : on ajoutera ici
// app.use('/api/auth',         require('./routes/authRoutes'));
// app.use('/api/users',        require('./routes/userRoutes'));
// Sprint 3 :
// app.use('/api/annonces',     require('./routes/annonceRoutes'));
// Sprint 4 :
// app.use('/api/messages',     require('./routes/messageRoutes'));
// app.use('/api/reservations', require('./routes/reservationRoutes'));
// Sprint 5 :
// app.use('/api/evaluations',  require('./routes/evaluationRoutes'));
// app.use('/api/signalements', require('./routes/signalementRoutes'));
// app.use('/api/admin',        require('./routes/adminRoutes'));

// ───────────────────────────────────────────────────
// GESTION DES ERREURS
// ───────────────────────────────────────────────────

// 404 — Route inconnue
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} introuvable` });
});

// Erreur globale — intercepte toutes les erreurs Express
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`❌ Erreur [${statusCode}] : ${err.message}`);
  res.status(statusCode).json({
    message: err.message || 'Erreur serveur interne',
  });
});

// ───────────────────────────────────────────────────
// DÉMARRAGE
// ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n⚡ Serveur SkillExchange lancé !`);
  console.log(`📡 http://localhost:${PORT}`);
  console.log(`🌍 Environnement : ${process.env.NODE_ENV}`);
});