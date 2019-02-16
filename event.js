const DB = require('./database').DB;

function generateId() {
    let maxId = 1;
    var events = DB.map(x => {
        return x.events;
    });
    var maxEventIds = events.map(x => {
        for (var value in x) {
            if(x[value].eventId > maxId) {
                maxId = x[value].eventId;
            }
        }
        return maxId;
    });
    return Math.max(...maxEventIds) + 1;
}

console.log(generateId());

function createEvent(eventName, eventDesc, eventDate) {

}

function deleteEvent(id) {

}

function modifyEvent(id, newName, newDesc, newDate) {

}

module.exports = {
    createEvent: createEvent,
    deleteEvent: deleteEvent,
    modifyEvent: modifyEvent
}