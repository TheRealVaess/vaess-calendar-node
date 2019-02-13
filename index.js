const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 5000;

const mySecret = 'dabmiaoubelettelolo17';
var token = "";

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

var BDD = [
    {username: 'Benjamin', password: "miaou", events: [
            {eventName: "event1", eventDesc: "test1"},
            {eventName: "event2", eventDesc: "test2"}
        ]},
    {username: 'Florian', password: "dab", events: [
            {eventName: "event1", eventDesc: "test1"}
        ]},
    {username: 'Yannick', password: "belette", events: [
            {eventName: "event1", eventDesc: "test1"},
            {eventName: "event2", eventDesc: "test2"},
            {eventName: "event3", eventDesc: "test3"}
        ]}
];

app.use(function(req, res, next) {
    if(token) {
        if(!req.headers) {
            req.headers = {};
        }
        req.headers['authorization'] = 'Bearer ' + token;
    }
    next();
});

/*_____________________________________________________________________
_______________________________________________________________________
_____________________________________________________________________*/

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = mySecret;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    var user = jwt_payload.login;
    done(null, user);
}));

/*_____________________________________________________________________
_______________________________________________________________________
_____________________________________________________________________*/

app.get('/', function (req, res) {
    res.send('Accueil');
});

app.get('/sign-in', function (req, res) {
    res.sendFile(path.join(__dirname+'/views/sign-in.html'));
    if(req.session.flash !== undefined) {
        var flashMsg = req.session.flash;
        req.session.flash = undefined;
        res.send(flashMsg);
    }
});

app.post('/sign-in', function (req, res) {
    if(req.body.name && req.body.mdp) {
        req.session.flash = "Votre compte a bien été créé !";
    } else {
        req.session.flash = "Il manque une information !";
    }
    res.redirect('/sign-in');
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname+'/views/sign-in.html'));
    if(req.session.flash !== undefined) {
        var flashMsg = req.session.flash;
        req.session.flash = undefined;
        res.send(flashMsg);
    }
});

app.post('/login', function (req, res) {
    if(req.body.name && req.body.mdp) {
        var name = req.body.name;
        var mdp = req.body.mdp;

        var user = BDD.find(user => {
            if(user.username === name && user.password === mdp) {
                return true;
            } else {
                return false;
            }
        });

        if(user) {
            req.session.flash = "Vous êtes authentifié !";
            token = jwt.sign({ login: user }, mySecret);
            res.redirect('/login');
        } else {
            res.status('401').json({error: 'Nom ou mdp incorrect.'});
            return;
        }
    } else {
        req.session.flash = "Informations manquantes !";
        res.redirect('/login');
    }
});

app.get('/events', passport.authenticate('jwt', {session: false}), function (req, res) {
    for(var i=0; i<=BDD.length; i++) {
        if(BDD[i].username === req.user.username && BDD[i].password === req.user.password) {
            res.send(BDD[i].events);
            break;
        }
    };
    res.send('Hello');
});

/*app.get('/events/:username/:eventId', function (req, res) {
    res.send('Hello World!');
});

app.get('/events/:username/add/:eventId', function (req, res) {
    res.send('Hello World!');
});

app.get('/events/:username/delete/:eventId', function (req, res) {
    res.send('Hello World!');
});*/

app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT);
});