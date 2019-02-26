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

function createEvent(name, desc, date) {
    DB.event.push({eventId: generateId(), eventName: name, eventDesc: desc, eventDate: date});
}

function deleteEvent(userId, eventId) {
    const events = getDBEventsByUser(userId);

    return delete events[eventId];
}

function modifyEvent(id, newName, newDesc, newDate) {
    const events = getDBEvents();
    const theEvent = events.find(event => {
        return event.eventId === +id;
    });

    if(theEvent) {
        theEvent.eventName = newName;
        theEvent.eventDesc = newDesc;
        theEvent.eventDate = newDate;
    } else {
        return false;
    }
}

module.exports = {
    createEvent: createEvent,
    deleteEvent: deleteEvent,
    modifyEvent: modifyEvent
}