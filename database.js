const BDD = [
    {
        userId: 1, username: 'Benjamin', password: "miaou", events: [
            {eventId: 1, eventName: "event1", eventDesc: "test1", eventDate: "2019-06-27"},
            {eventId: 2, eventName: "event2", eventDesc: "test2", eventDate: "2019-11-09"}
        ]
    },
    {
        userId: 2, username: 'Glandu', password: "password", events: [
            {eventId: 3, eventName: "event1", eventDesc: "test1", eventDate: "2020-01-01"}
        ]
    }
];

module.exports = {
    DB: BDD
}
