const DB = require('./database').DB;

function generateId() {
    const userIds = DB.map(x => {
        return x.userId;
    });
    return Math.max(...userIds) + 1;
}

function createUser(name, pswd) {
    return DB.push({ userId: generateId(), username: name, password: pswd, events: []});
}

function deleteUser(id) {
    const theUserId = DB.findIndex(user => user.userId === +id);
    return DB.splice(theUserId, 1);
}

function modifyUserName(id, newUsername) {
    const theUser = DB.find(user => user.userId === +id);
    return (theUser.username = newUsername);
}

function modifyUserPassword(id, oldPassword, newPassword) {
    const theUser = DB.find(user => user.userId === +id);
    if(oldPassword === theUser.password) {
        return (theUser.password = newPassword);
    } else {
        return false;
    }
}

module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    modifyUserName: modifyUserName,
    modifyUserPassword: modifyUserPassword
}