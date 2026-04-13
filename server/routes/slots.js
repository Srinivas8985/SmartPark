const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const auth = require('../middleware/auth');

// @route   GET api/slots/smart-price
// @desc    Get smart price suggestion
// @access  Private
router.get('/smart-price', auth, slotController.getSmartPrice);

// @route   POST api/slots
// @desc    Add new parking slot
// @access  Private (Owner)
router.post('/', auth, slotController.createSlot);

// @route   GET api/slots
// @desc    Get all slots (search)
// @access  Public
router.get('/', slotController.getSlots);

// @route   GET api/slots/:id
// @desc    Get slot by ID
// @access  Public
router.get('/:id', slotController.getSlotById);

// @route   DELETE api/slots/:id
// @desc    Delete slot
// @access  Private (Owner)
router.delete('/:id', auth, slotController.deleteSlot);

// @route   POST api/slots/:id/lock
// @desc    Temporarily lock a slot
// @access  Private
router.post('/:id/lock', auth, slotController.lockSlot);

// @route   POST api/slots/:id/unlock
// @desc    Unlock a slot
// @access  Private
router.post('/:id/unlock', auth, slotController.unlockSlot);

module.exports = router;
