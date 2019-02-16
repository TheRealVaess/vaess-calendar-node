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
    DB.push({username: req.body.name, password: req.body.mdp, events: []});
    res.send(DB)
});

app.post('/login', function (req, res) {
    if(req.body.name && req.body.mdp) {
        var name = req.body.name;
        var mdp = req.body.mdp;

        var user = DB.find(user => {
            if(user.username === name && user.password === mdp) {
                return true;
            } else {
                return false;
            }
        });

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
    var events;
    for(var i=0; i<=DB.length; i++) {
        if(DB[i].username === req.user.username && DB[i].password === req.user.password) {
            events = DB[i].events;
            break;
        }
    };
    res.send(events);
});

/*app.get('/events/:eventId', function (req, res) {
    res.send('Hello World!');
});

app.post('/events/add/:eventId', function (req, res) {
    res.send('Hello World!');
});

app.post('/events/delete/:eventId', function (req, res) {
    res.send('Hello World!');
});*/

app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT);
});