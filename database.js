const BDD = [
    {
        userId: 1, username: 'Benjamin', password: "miaou", events: [
            {eventId: 1, eventName: "event1", eventDesc: "test1", eventDate: "27/06/2019"},
            {eventId: 2, eventName: "event2", eventDesc: "test2", eventDate: "09/11/2019"}
        ]
    },
    {
        userId: 2, username: 'Glandu', password: "password", events: [
            {eventId: 3, eventName: "event1", eventDesc: "test1", eventDate: "01/01/2020"}
        ]
    }
];

module.exports = {
    DB: BDD
}