const mongoose = require("mongoose");
const Hackathon =require("../models/hackathon-model")
async function handleShowAllHackathons (req, res) {
    try {
        await Hackathon.find({}, (err, hackathons) => {
            if (err) {
                console.log(err);
            } else {
                res.json(hackathons);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

function handleDescribeHackathon (req, res) {
    console.log("you are seeing the description of the hackathon");
}

async function handleCreateHackathon (req, res) {
    const obj = req.body;

    try {
        const newHackathon = await new Hackathon({
            name: obj.name,
            description: obj.description,
            start: obj.start,
            end: obj.end,
            // BHAI aama error aavi sake chhe, joje 👇
            organizer: req.user._id,
            maxParticipants: obj.maxParticipants,
            judges: obj.judges,
            prizes: obj.prizes,
            rulesAndRegulations: obj.rulesAndRegulations,
            theme: obj.theme,
            techTags: obj.techTags,
        });


    } catch (error) {
        console.log(error);
    }
    console.log("you are seeing the description of the hackathon");
}

module.exports = {
    handleShowAllHackathons,
    handleDescribeHackathon,
    handleCreateHackathon
}