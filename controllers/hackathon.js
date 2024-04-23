const mongoose = require("mongoose");
const Hackathon = require("../models/hackathon-model")
const nanoId = require("nano-id");
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

async function handleDescribeHackathon (req, res) {
    const hackathonId = req.params.hackathonId;
    
    try {
        const result = await Hackathon.find({
            id: hackathonId,
        });
        
        if(!result) {
            return res.status(404).json({
                error: "Hackathon not found",
            });
        }
        return res.status(200).json({
            hackathon: result[0],
        });
    } catch (error) {
        console.log(error);
        res.json({error: error.message});
    }
}

async function handleCreateHackathon (req, res) {
    const obj = req.body;

    try {
        const newHackathon = await Hackathon.create({
            id: nanoId(20),
            name: obj.name,
            description: obj.description,
            start: obj.start,
            end: obj.end,
            organizer: req.user._id,
            maxParticipants: obj.maxParticipants,
            judges: obj.judges,
            prizes: obj.prizes,
            rulesAndRegulations: obj.rulesAndRegulations,
            theme: obj.theme,
            techTags: obj.techTags,
        });
        return res.status(201).json({
            hackathon: newHackathon,
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    handleShowAllHackathons,
    handleDescribeHackathon,
    handleCreateHackathon
}