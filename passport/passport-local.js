'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/admin');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) =>{
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findOne({'email' : email}, (err, user) => {
        if(err){
            return done(err);
        }
        if(user){
            return done(null, false, req.flash('error', 'User with email already exist'));
        }

        const newUser =  new User();
        newUser.username = req.body.username;
        newUser.fullname = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(password);

        newUser.save((err) => {
            done(null, newUser);
        })

    })


}));
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validUserPassword(password)) {
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    });

}));





// var LocalStrategy = require('passport-local').Strategy;
// var passport = require('passport');
// var User = require('../models/user');
// var Admin = require('../models/admin');

// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });
// passport.deserializeUser(function (id, done) {
//     User.findById(id, function (err, user) {
//         done(err, user);
//     });
// });

// passport.use('local.signup', new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true
// }, function (req, email, password, done) {
//     process.nextTick(function () {
//         User.findOne({'email': email}, function (err, user) {
//             if (err) {
//                 return done(err);
//             }
//             if (user) {
//                 return done(null, false, {message: 'Email is already taken.'});
//             }
//             var newUser = new User();
//             newUser.username = req.body.username;
//             newUser.email = req.body.email;
//             newUser.password = newUser.encryptPassword(password);
           
//             newUser.save(function (err, result) {
//                 if (err) {
//                     return done(err);
//                 }
//                 return done(null, newUser);
//             });
//         });
//     });
// }));

// passport.use('local.login', new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true
// }, function (req, email, password, done) {
//     User.findOne({'email': email}, function (err, user) {
//         if (err) {
//             return done(err);
//         }
//         if (!user) {
//             return done(null, false, {message: 'No user found.'});
//         }
//         if (!user.validUserPassword(password)) {
//             return done(null, false, {message: 'Wrong password.'});
//         }
//         return done(null, user);
//     });

// }));


passport.use('admin.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    Admin.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (password != "admin") {
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    });
    
}));






