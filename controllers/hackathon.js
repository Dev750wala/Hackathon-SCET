function handleShowAllHackathons (req, res) {
    console.log("You are at show all hackathons page");
}

function handleDescribeHackathon (req, res) {
    console.log("you are seeing the description of the hackathon");
}

module.exports = {
    handleShowAllHackathons,
    handleDescribeHackathon
}