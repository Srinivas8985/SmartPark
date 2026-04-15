const ParkingSlot = require('../models/ParkingSlot');

// @desc    Create a parking slot
// @route   POST /api/slots
// @access  Private (Owner only)
exports.createSlot = async (req, res) => {
    try {
        const { name, description, address, pricePerHour, startTime, endTime, coordinates, totalSpots, amenities } = req.body;

        const owner = req.user.id;

        // Construct Location GeoJSON if coordinates provided [lng, lat]
        let location = { type: 'Point', coordinates: [0, 0] };
        if (coordinates && coordinates.length === 2) {
            location.coordinates = coordinates;
        }

        const newSlot = new ParkingSlot({
            owner,
            name,
            description,
            address,
            pricePerHour,
            totalSpots: totalSpots || 1,
            availableSpots: totalSpots || 1,
            amenities: amenities || [],
            availability: {
                startTime: startTime || '00:00',
                endTime: endTime || '23:59'
            },
            location
        });

        const slot = await newSlot.save();
        res.json(slot);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get smart price suggestion
// @route   GET /api/slots/smart-price
// @access  Private (Owner)
exports.getSmartPrice = async (req, res) => {
    try {
        // Mock Smart Logic: base price + random demand factor
        // In real app: analyze historical bookings, time of day, location density
        const basePrice = 50;
        const demandFactor = Math.random() * (1.5 - 0.8) + 0.8; // 0.8 to 1.5x
        const suggestedPrice = Math.round(basePrice * demandFactor);

        res.json({ suggestedPrice, demandLevel: demandFactor > 1.2 ? 'High' : 'Normal' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Lock Slot
exports.lockSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.findById(req.params.id);
        if (!slot) return res.status(404).json({ msg: 'Slot not found' });
        
        slot.locked = true;
        slot.lockExpiry = new Date(Date.now() + 5 * 60000); // 5 mins
        await slot.save();
        res.json({ msg: 'Slot temporarily locked', slot });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Unlock Slot
exports.unlockSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.findById(req.params.id);
        if (!slot) return res.status(404).json({ msg: 'Slot not found' });
        
        slot.locked = false;
        slot.lockExpiry = null;
        await slot.save();
        res.json({ msg: 'Slot unlocked', slot });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get all slots (with optional filters)
exports.getSlots = async (req, res) => {
    try {
        const { location } = req.query;
        let query = {};

        if (location) {
            query.address = { $regex: location, $options: 'i' };
        }

        const slots = await ParkingSlot.find(query).populate('owner', 'name email phone');
        res.json(slots);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get single slot by ID
exports.getSlotById = async (req, res) => {
    try {
        const slot = await ParkingSlot.findById(req.params.id).populate('owner', 'name email phone');
        if (!slot) return res.status(404).json({ msg: 'Slot not found' });
        res.json(slot);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Slot not found' });
        res.status(500).send('Server Error');
    }
};

// Delete a slot
exports.deleteSlot = async (req, res) => {
    try {
        const slot = await ParkingSlot.findById(req.params.id);
        if (!slot) return res.status(404).json({ msg: 'Slot not found' });

        // Check user
        if (slot.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await slot.deleteOne();
        res.json({ msg: 'Slot removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
