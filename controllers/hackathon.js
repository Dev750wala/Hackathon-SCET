const mongoose = require("mongoose");
const Hackathon =require("../models/hackathon-model")
function handleShowAllHackathons (req, res) {
    //
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
            location: obj.location,
            // BHAI aama chhe ne organizer ma pella user check karje cookies mathi, pachi cookies mathi je user male tenu naam organizer ma add karje.
            // organizer: req.user,
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