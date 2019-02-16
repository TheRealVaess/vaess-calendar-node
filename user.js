const DB = require('./database').DB;

function generateId() {
    var userIds = DB.map(x => {
        return x.userId;
    });
    return Math.max(...userIds) + 1;
}

function createUser(username, password) {

}

function deleteUser(id) {

}

function modifyUserName(id, newUsername) {

}

function modifyUserPassword(id, newPassword) {

}

module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    modifyUserName: modifyUserName,
    modifyUserPassword: modifyUserPassword
}