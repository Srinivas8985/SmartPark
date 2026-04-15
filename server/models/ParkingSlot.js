const mongoose = require('mongoose');

const ParkingSlotSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        required: true,
    },
    pricePerHour: {
        type: Number,
        required: true,
    },
    totalSpots: {
        type: Number,
        default: 1
    },
    availableSpots: {
        type: Number,
        default: 1
    },
    amenities: [
        {
            type: String
        }
    ],
    images: [
        {
            type: String,
        },
    ],
    availability: {
        startTime: {
            type: String, // e.g., "09:00"
            required: true
        },
        endTime: {
            type: String, // e.g., "18:00"
            required: true
        }
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: false // Optional for now until map is fully integrated
        }
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create index for geospatial queries
ParkingSlotSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('ParkingSlot', ParkingSlotSchema);
