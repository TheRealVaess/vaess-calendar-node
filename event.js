const DB = require('./database').DB;

function getDBEvents() {
    return DB.reduce((res, cur) => {
        return res.concat(cur.events)
    }, []);
}

function getDBEventsByUser(userId) {
    const user = DB.find(user => {
        return user.userId === +userId;
    });

    return user.events;
}

function generateId() {
    const events = getDBEvents();

    const maxId = events.reduce((res, cur) => Math.max(res, cur.eventId), 0) + 1;
    return maxId;
}

function createEvent(userId, name, desc, date) {
    const events = getDBEventsByUser(userId);
    return events.push({eventId: generateId(), eventName: name, eventDesc: desc, eventDate: date});
}

function deleteEvent(userId, eventId) {
    const events = getDBEventsByUser(userId);
    return delete events[eventId];
}

function modifyEvent(userId, eventId, newName, newDesc, newDate) {
    const events = getDBEventsByUser(userId);
    return (events[eventId].eventName = newName) && (events[eventId].eventDesc = newDesc) && (events[eventId].eventDate = newDate);
}

module.exports = {
    createEvent: createEvent,
    deleteEvent: deleteEvent,
    modifyEvent: modifyEvent
}