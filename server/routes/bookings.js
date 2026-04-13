const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// @route   POST api/bookings
// @desc    Create a booking
// @access  Private (Driver)
router.post('/', auth, bookingController.createBooking);

// @route   GET api/bookings/my-bookings
// @desc    Get logged in user's bookings (Driver)
// @access  Private
router.get('/my-bookings', auth, bookingController.getMyBookings);

// @route   GET api/bookings/owner-bookings
// @desc    Get bookings for owner's slots
// @access  Private (Owner)
router.get('/owner-bookings', auth, bookingController.getOwnerBookings);

// @route   PUT api/bookings/:id
// @desc    Update booking status (Owner)
// @access  Private (Owner)
router.put('/:id', auth, bookingController.updateBookingStatus);

// @route   PUT api/bookings/:id/cancel
// @desc    Cancel booking (Driver)
// @access  Private (Driver)
router.put('/:id/cancel', auth, bookingController.cancelBooking);

// @route   GET api/bookings/:id/qr
// @desc    Get Booking QR Code
// @access  Private
router.get('/:id/qr', auth, bookingController.getBookingQR);

module.exports = router;
