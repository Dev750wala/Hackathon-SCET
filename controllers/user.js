async function handleUserSignup (req, res) {
    res.send("You are at signup page");
}

async function handleUserLogin (req, res) {
    res.send("You are at login page");
}

async function handleUserProfile (req, res) {
    res.send("You are at profile page");
}

async function handleUserLogout (req, res) {
    res.send("You are at logout page");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserProfile,
    handleUserLogout,
}