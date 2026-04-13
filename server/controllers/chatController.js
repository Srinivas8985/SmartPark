const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/chat/send
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, slotId, content } = req.body;
        const senderId = req.user.id;

        if (!content || !receiverId) {
            return res.status(400).json({ msg: 'Message content and receiver required' });
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            slot: slotId || null,
            content
        });

        const savedMessage = await newMessage.save();

        // Socket.io: Emit to receiver
        const io = req.app.get('io');
        io.to(receiverId).emit('receiveMessage', savedMessage);

        res.status(201).json(savedMessage);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get messages between current user and another
// @route   GET /api/chat/:userId
// @access  Private
exports.getConversation = async (req, res) => {
    try {
        const otherUserId = req.params.userId;
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        }).sort({ createdAt: 1 }); // Oldest first

        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get list of contacts (people messaged with)
// @route   GET /api/chat/contacts
// @access  Private
exports.getContacts = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Find all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        }).populate('sender', 'name email role').populate('receiver', 'name email role').sort({ createdAt: -1 });

        const contacts = [];
        const seenIds = new Set();

        messages.forEach(msg => {
            const otherUser = msg.sender._id.toString() === currentUserId ? msg.receiver : msg.sender;
            if (!seenIds.has(otherUser._id.toString())) {
                contacts.push({
                    user: otherUser,
                    lastMessage: msg.content,
                    timestamp: msg.createdAt
                });
                seenIds.add(otherUser._id.toString());
            }
        });

        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
