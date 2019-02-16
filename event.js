const DB = require('./database').DB;

function generateId() {
    var events = DB.map(x => {
        return x.events;
    });
    var eventIds = events.map(x => {
        return x.eventId;
    });

    return eventIds;
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