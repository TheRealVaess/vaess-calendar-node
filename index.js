const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 5000;
const DB = require('./database').DB;
const userUtil = require('./user.js');
const eventUtil = require('./event.js');

const mySecret = 'dabmiaoubelettelolo17';
var token = "";

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

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
    res.send(DB);
});

app.post('/sign-in', function (req, res) {
    if(req.body.name && req.body.password) {
        let name = req.body.name;
        let mdp = req.body.password;

        let user = DB.find(user => (user.username === name) && (user.password === mdp));

        if(user) {
            res.send("Erreur : L'utilisateur existe déjà.")
        } else {
            let userAdded = userUtil.createUser(name, mdp);
            res.send(userAdded);
        }
    } else {
        res.send("Erreur : Informations manquantes !");
    }
});

app.post('/login', function (req, res) {
    if(req.body.name && req.body.password) {
        let name = req.body.name;
        let mdp = req.body.password;

        let user = DB.find(user => (user.username === name) && (user.password === mdp));

        if(user) {
            token = jwt.sign({ login: user }, mySecret);
            res.send(token);
        } else {
            res.send("Erreur : Nom ou mdp incorrect.")
        }
    } else {
        res.send("Erreur : Informations manquantes !");
    }
});

app.get('/events', passport.authenticate('jwt', {session: false}), function (req, res) {
    res.send(eventUtil.getDBEventsByUser(req.user.userId));
});

app.get('/events/:eventId', passport.authenticate('jwt', {session: false}), function (req, res) {
    res.send(eventUtil.getDBEventDetailsByUser(req.params.eventId, req.user.userId));
});

app.post('/events/add', passport.authenticate('jwt', {session: false}), function (req, res) {
    if(req.body.newName && req.body.newDesc && req.body.newDate) {
        let newName = req.body.newName;
        let newDesc = req.body.newDesc;
        let newDate = req.body.newDate;

        if(eventUtil.createEvent(req.user.userId, newName, newDesc, newDate)) {
            res.send("Evenement créé !");
        } else {
            res.send("Erreur lors de la création.");
        }
    } else {
        res.send("Informations manquantes !");
    }
});

app.post('/events/delete/:eventId', function (req, res) {
    if(eventUtil.deleteEvent(req.params.eventId)) {
        res.send('Evènement supprimé !');
    } else {
        res.send('Evènement non-existant.');
    }
});

app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT);
});