const DB = require('./database').DB;

//TODO test pour remplacer les delete par des splice

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

function getDBEventDetailsByUser(evId, userId) {
    const userEvents = getDBEventsByUser(userId);
    return userEvents.find(event => {
        return event.eventId === +evId;
    });
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
    const theEventId = events.findIndex(event => event.eventId === +eventId);
    return events.splice(theEventId, 1);
}

function modifyEvent(userId, eventId, newName, newDesc, newDate) {
    const events = getDBEventsByUser(userId);
    const theEventId = events.findIndex(event => event.eventId === +eventId);
    return (events[theEventId].eventName = newName) && (events[theEventId].eventDesc = newDesc) && (events[theEventId].eventDate = newDate);
}

module.exports = {
    createEvent: createEvent,
    deleteEvent: deleteEvent,
    modifyEvent: modifyEvent,
    getDBEventsByUser: getDBEventsByUser,
    getDBEventDetailsByUser: getDBEventDetailsByUser
}