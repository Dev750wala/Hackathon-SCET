const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    location: {
        type: Date,
        required: true,
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    participants: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    judges: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    prizes: {
        type: String,
    },
    rulesAndRegulations: {
        type: String,
        required: true,
    },
    theme: {
        type: String,
    },
    projects: {
        name: String,
        description: String,
        teamMembers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }]
    }
})

const Hackathon = mongoose.model('hackathon', hackathonSchema);

module.exports = Hackathon;