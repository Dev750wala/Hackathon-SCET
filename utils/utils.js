const decideRole = function (email) {
    const student;
    email.includes("scet.ac.in") ? student=true : student=false;

    return student;
}

module.exports = {
    decideRole
};