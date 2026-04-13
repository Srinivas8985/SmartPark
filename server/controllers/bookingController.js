const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');
const emailService = require('../utils/emailService');
const QRCode = require('qrcode');

// Create a booking
exports.createBooking = async (req, res) => {
    try {
        const { slotId, startTime, endTime, totalAmount } = req.body;

        const newBooking = new Booking({
            slot: slotId,
            driver: req.user.id,
            startTime,
            endTime,
            totalAmount,
            status: 'PENDING'
        });

        const booking = await newBooking.save();

        // Populate for email
        await booking.populate('driver', 'email name');
        await booking.populate('slot', 'name address');

        // Send Email
        await emailService.sendBookingConfirmation(booking.driver.email, {
            slot: booking.slot.name,
            time: startTime
        });

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get my bookings (Driver)
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ driver: req.user.id })
            .populate({
                path: 'slot',
                select: 'name address pricePerHour images owner',
                populate: {
                    path: 'owner',
                    select: 'name email'
                }
            })
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get bookings for my slots (Owner)
exports.getOwnerBookings = async (req, res) => {
    try {
        const slots = await ParkingSlot.find({ owner: req.user.id });
        const slotIds = slots.map(slot => slot._id);

        const bookings = await Booking.find({ slot: { $in: slotIds } })
            .populate('slot', 'name')
            .populate('driver', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update booking status (Owner/Admin)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id).populate('slot').populate('driver');

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        if (booking.slot.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

        if (status === 'CONFIRMED' || status === 'REJECTED') {
            // emailService.sendStatusUpdate(...)
        }

        res.json(booking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Cancel Booking (Driver)
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('driver');
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        if (booking.driver._id.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
            return res.status(400).json({ msg: 'Cannot cancel this booking' });
        }

        booking.status = 'CANCELLED';
        await booking.save();

        // Refund Logic (Mock)
        // console.log(`Refund initiated for ${booking.totalAmount}`);

        await emailService.sendCancellation(booking.driver.email, { bookingId: booking._id });

        res.json({ msg: 'Booking Cancelled. Refund initiated.', booking });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Get Booking QR
exports.getBookingQR = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        // Verify user is driver or owner
        // ...

        const qrData = JSON.stringify({
            bookingId: booking._id,
            slotId: booking.slot,
            driverId: booking.driver
        });

        const qrCode = await QRCode.toDataURL(qrData);
        res.json({ qrCode });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
