const decideRole = function (email) {
    var student;
    email.includes("scet.ac.in") ? student=true : student=false;

    return student;
}

module.exports = {
    decideRole
};