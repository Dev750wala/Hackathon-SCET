// 1.> GET /hackathon                   => to render the page, where all the hackathons will be listed.
// 2.> GET /hackathon/:hackathonId      => to render the page of hackathon, where it is described in detail.

const express = require("express");
const router = express.Router();
const { handleShowAllHackathons, handleDescribeHackathon } = require("../controllers/hackathon");

router
    .get("/", handleShowAllHackathons)

    .get("/:hackathonId", handleDescribeHackathon);

module.exports = router;