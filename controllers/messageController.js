const Message = require('../models/Message');
const User = require('../models/User');

// GET /api/messages/conversations
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    // mssgs envoyés , reçus
    const messages = await Message.find({ $or: [{ fromId: userId }, { toId: userId }] })
      .populate('fromId', 'nom prenom avatar')
      .populate('toId', 'nom prenom avatar')
      .sort({ createdAt: -1 });

    const convMap = {};
    messages.forEach(msg => {
      const other = msg.fromId._id.toString() === userId
        ? msg.toId // sent
        : msg.fromId; // receive
      const otherId = other._id.toString();

      if (!convMap[otherId]) {
        convMap[otherId] = {
          interlocuteur: other,
          dernierMessage: msg,
          nonLus: 0,
        };
      }
      if (msg.toId._id.toString() === userId && !msg.read) {
        convMap[otherId].nonLus++;
      }
    });

    res.json({ conversations: Object.values(convMap) });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /api/messages/:userId
const getMessages = async (req, res) => {
  try {
    const myId = req.user.id;
    const otherId = req.params.userId;

    // Récupérer tous les messages de la conversation
    const messages = await Message.find({
        $or: [
          { fromId: myId,    toId: otherId },
          { fromId: otherId, toId: myId    },
        ],
      })
      .populate('fromId', 'nom prenom')
      .sort({ createdAt: 1 }); 
    //mssg reçus deviennent lus
    await Message.updateMany(
      { fromId: otherId, toId: myId, read: false },
      { $set: { read: true } }
    );
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { toId, content } = req.body;

    if (!toId || !content?.trim()) {
      return res.status(400).json({ message: 'Destinataire et contenu requis' });
    }

    // Vérifier que le destinataire existe
    const recipient = await User.findById(toId);
    if (!recipient) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const message = await Message.create({
      fromId: req.user.id,
      toId,
      content: content.trim(),
    });

    await message.populate('fromId', 'nom prenom');

    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// GET /api/messages/unread-count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      toId: req.user.id,
      read: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getConversations, getMessages, sendMessage, getUnreadCount };