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

        let user = DB.find(user => user.username === name);

        if(user) {
            res.send("Erreur : L'utilisateur existe déjà.")
        } else {
            if(userUtil.createUser(name, mdp)) {
                res.send("Compte créé !");
            }
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

app.get('/deleteAccount', passport.authenticate('jwt', {session: false}), function (req, res) {
    if(req.user.userId) {
        if(userUtil.deleteUser(req.user.userId)) {
            res.send("Compte supprimé !");
        } else {
            res.send("Erreur lors de la suppression du compte.")
        }
    } else {
        res.send("Vous n'êtes pas login.");
    }
});

app.get('/modifyUserName', passport.authenticate('jwt', {session: false}), function (req, res) {
    if(req.user.userId && req.body.newUserName) {
        if(userUtil.modifyUserName(req.user.userId, req.body.newUserName)) {
            res.send("Nom modifié !");
        } else {
            res.send("Erreur lors de la modification du nom.")
        }
    } else {
        res.send("Erreur : Informations manquantes !");
    }
});

app.get('/modifyPassWord', passport.authenticate('jwt', {session: false}), function (req, res) {
    if(req.user.userId && req.body.oldPassword && req.body.newPassword) {
        if(userUtil.modifyUserPassword(req.user.userId, req.body.oldPassword, req.body.newPassword)) {
            res.send("Mot de passe modifié !");
        } else {
            res.send("Erreur lors de la modification du mot de passe.")
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

app.post('/events/delete/:eventId', passport.authenticate('jwt', {session: false}), function (req, res) {
    if(req.user.userId && req.params.eventId) {
        if(eventUtil.deleteEvent(req.user.userId, req.params.eventId)) {
            res.send('Evènement supprimé !');
        } else {
            res.send('Erreur lors de la suppression.');
        }
    } else {
        res.send("Evènement non-existant.");
    }
});

app.post('/events/modify/:eventId', passport.authenticate('jwt', {session: false}), function (req, res) {
    if(req.body.newName && req.body.newDesc && req.body.newDate) {
        let newName = req.body.newName;
        let newDesc = req.body.newDesc;
        let newDate = req.body.newDate;

        if(eventUtil.modifyEvent(req.user.userId, req.params.eventId, newName, newDesc, newDate)) {
            res.send("Evenement modifié !");
        } else {
            res.send("Erreur lors de la modification.");
        }
    } else {
        res.send("Informations manquantes !");
    }
});

app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT);
});