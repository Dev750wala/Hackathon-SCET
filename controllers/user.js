const handleUserSignup = async function (req, res) {
    res.send("You are at signup page");
}

const handleUserLogin = async function (req, res) {
    res.send("You are at login page");
}

const handleUserProfile = async function (req, res) {
    res.send("You are at profile page");
}

const handleUserLogout = async function (req, res) {
    res.send("You are at logout page");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserProfile,
    handleUserLogout,
}