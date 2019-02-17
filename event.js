const DB = require('./database').DB;

function getDBEvents() {
    return DB.reduce((res, cur) => {
        return res.concat(cur.events)
    }, []);
}

function generateId() {
    const events = getDBEvents();

    const maxId = events.reduce((res, cur) => Math.max(res, cur.eventId), 0) + 1;
    return maxId;
}

function createEvent(name, desc, date) {
    DB.event.push({eventId: generateId(), eventName: name, eventDesc: desc, eventDate: date});
}

function deleteEvent(id) {
    const events = getDBEvents();
    const theEvent = events.find(event => {
        if(event.eventId == id) {
            return true;
        } else {
            return false;
        }
    });

    if(theEvent) {
        delete theEvent;
    } else {
        return false;
    }
}

function modifyEvent(id, newName, newDesc, newDate) {
    const events = getDBEvents();
    const theEvent = events.find(event => {
        if(event.eventId == id) {
            return true;
        } else {
            return false;
        }
    });

    if(theEvent) {
        theEvent.eventName = newName;
        theEvent.eventDesc = newDesc;
        theEvent.eventDate = newDate;
    }
}

module.exports = {
    createEvent: createEvent,
    deleteEvent: deleteEvent,
    modifyEvent: modifyEvent
}