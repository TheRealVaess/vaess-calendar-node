const DB = require('./database').DB;

function generateId() {
    const userIds = DB.map(x => {
        return x.userId;
    });
    return Math.max(...userIds) + 1;
}

function createUser(name, pswd) {
    DB.push({ userId: generateId(), username: name, password: pswd, events: []});
}

function deleteUser(id) {
    const theUser = DB.find(user => user.eventId === +id);

    if(theUser) {
        delete theUser;
        return true;
    } else {
        return false;
    }
}

function modifyUserName(id, newUsername) {
    const theUser = DB.find(user => user.eventId === +id);

    if(theUser) {
        theUser.username = newUsername;
        return true;
    } else {
        return false;
    }
}

function modifyUserPassword(id, newPassword) {
    const theUser = DB.find(user => user.eventId === +id);

    if(theUser) {
        theUser.password = newPassword;
        return true;
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