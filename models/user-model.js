'use strict';

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    enrollmentNumber: {
        type: String,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
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
    // address: {
    //     type: String,
    //     required: true,
    // },
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
        default: false,
    },
    registrationDate: {
        type: Date,
        default: Date.now(),
    }
});

userSchema.pre("save", async function(next) {
    try {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); 
    }
})

userSchema.statics.login = async function (input, usernameOrEmail, password) {
    let user;

    if(input === "email") {
        user = await this.findOne({email: usernameOrEmail});
    } else {
        user = await this.findOne({username: usernameOrEmail});
    }
    
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) return user;
        throw Error("Incorrect password");
    }
    throw Error("User not found");
}

const USER = mongoose.model('user', userSchema);

module.exports = USER;