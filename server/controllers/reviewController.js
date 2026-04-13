const Review = require('../models/Review');
const ParkingSlot = require('../models/ParkingSlot');

// @desc    Add a review
// @route   POST /api/reviews/:slotId
// @access  Private (Driver only ideally, but generic User for now)
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const slotId = req.params.slotId;
        const userId = req.user.id; // From auth middleware

        // Validate basic input
        if (!rating || !comment) {
            return res.status(400).json({ msg: 'Please provide both rating and comment' });
        }

        // Check if slot exists
        const slot = await ParkingSlot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ msg: 'Parking slot not found' });
        }

        // Create review
        const newReview = new Review({
            user: userId,
            slot: slotId,
            rating,
            comment
        });

        const savedReview = await newReview.save();

        // Populate user name for immediate frontend display
        await savedReview.populate('user', 'name');

        res.status(201).json(savedReview);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get reviews for a slot
// @route   GET /api/reviews/:slotId
// @access  Public
exports.getSlotReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ slot: req.params.slotId })
            .sort({ createdAt: -1 })
            .populate('user', 'name'); // Get reviewer name

        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
