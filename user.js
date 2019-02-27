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
    return delete DB[theUserId];
}

function modifyUserName(id, newUsername) {
    const theUser = DB.find(user => user.userId === +id);
    return (theUser.username = newUsername);
}

function modifyUserPassword(id, newPassword) {
    const theUser = DB.find(user => user.userId === +id);
    return (theUser.password = newPassword);
}

module.exports = {
    createUser: createUser,
    deleteUser: deleteUser,
    modifyUserName: modifyUserName,
    modifyUserPassword: modifyUserPassword
}