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
    const theUser = DB.find(user => {
        if(user.eventId == id) {
            return true;
        } else {
            return false;
        }
    });

    if(theUser) {
        delete theUser;
    }
}

function modifyUserName(id, newUsername) {
    const theUser = DB.find(user => {
        if(user.eventId == id) {
            return true;
        } else {
            return false;
        }
    });

    if(theUser) {
        theUser.username = newUsername;
    }
}

function modifyUserPassword(id, newPassword) {
    const theUser = DB.find(user => {
        if(user.eventId == id) {
            return true;
        } else {
            return false;
        }
    });

    if(theUser) {
        theUser.password = newPassword;
    }
}

module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    modifyUserName: modifyUserName,
    modifyUserPassword: modifyUserPassword
}