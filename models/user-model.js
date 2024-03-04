'use strict';

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        rquired: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        required: true,
        // af
        enum: ['participant', 'organizer', 'judge'],
        default: 'participant',
    },
    fullName: {
        type: String,
        required: true,
    },
    profile_pic: {
        // BHAI aama dhyan rakhje, buffer pn aavi sake
        type: String,
    },
    contact_no: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
    },
    biography: {
        type: String
    },
    portfolio: {
        type: String
    },
    socialLinks: {
        linkedin: {
            type: String
        },
        github: {
            type: String,
        },
    },
    participationHistory: [{
        eventName: {
            type: String,
        },
        date: {
            type: String
        },
        awards: {
            type: [String],
        }
    }],
    availability: {
        type: Boolean,
    },
    registrationDate: {
        type: Date,
        default: Date.now(),
    }
});

const USER = mongoose.model('user', userSchema);

module.exports = USER;