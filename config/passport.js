



const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Laad Gebruiker Model
const User = require('../models/gebruikers');
const bcryptjs = require('bcryptjs');

module.exports = function(passport) {
   passport.use(
      new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
         
         // Gebruiker koppelen
         User.findOne({ email: email })
         .then(user => {
            if(!user) {
               console.log("Geen gegevens gevonden in de database");
               return done(null, false);
            }

            // Wachtwoord koppelen
            bcryptjs.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if(isMatch) {
               console.log("Gegevens komen overeen met die in de database");
               return done(null, user);
            } else {
               return done(null, false);
            }
            });
         })
         .catch(err => console.log(err));
      })
   );

   passport.serializeUser((user, done) => {
      done(null, user.id);
   });

   passport.deserializeUser((id, done) => {
      User.findById(id, (err, user) => {
         console.log("Sessie gehost");
         done(err, user);
      });
   });

}





// Node.js With Passport Authentication | Full Project. (2018, 29 december). [Video]. YouTube. https://www.youtube.com/watch?v=6FOq4cUdH8k