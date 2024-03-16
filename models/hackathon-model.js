const mongoose = require("mongoose");
const nanoId = require("nano-id");

const hackathonSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        unique: true,
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
    maxParticipants: {
        type: Number,
    },
    judges: [
        {
            name: {
                type: String,
            },
        }
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'user',
    ],
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
    techTags: [
        {
            name: {
                type: String,
            }
        }
    ],
    participantTeam: {
        name: String,
        description: String,
        teamMembers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        }]
    }
})

hackathonSchema.pre('save', (next) => {
    this.id = nanoId(20);
    console.log(this.id);
    next();
})

const Hackathon = mongoose.model('hackathon', hackathonSchema);

module.exports = Hackathon;