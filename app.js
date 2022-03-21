



const express = require("express")
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();


//Passport configuratie
require("./config/passport")(passport);

require("dotenv").config();

// Mongoose
const dbURI = process.env.dbURI

const mongoose = require("mongoose")

mongoose.connect(dbURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true    
})

mongoose.connection.once("open", () => {
    console.log("Verbonden met de database")
})


// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");


// Bodyparser
app.use(express.urlencoded({ extended: false }));


 // Express Sessions
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));


// Passport
app.use(passport.initialize());
app.use(passport.session());


// Flash
app.use(flash());


// Global Var
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");

    next();
});


// Express
app.use(express.static("public"))
app.use("/css", express.static(__dirname + "public/css"))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.info(`App listening on port ${PORT}`));


const router = express.Router();
const { ensureAuthenticated } = require("./config/auth");

const bcrypt = require("bcryptjs");

// Gebruikers 
const User = require("./models/gebruikers");




// Express Layouts
app.set("layout", "./layouts/standard")





// Routes
app.get("/", ensureAuthenticated, (req, res) => {
    res.render("index", { title: "for_you", name: req.user.name, layout: "./layouts/include_nav"})
});

app.get("/sign_up", (req, res) => {
    res.render("sign_up", { title: "sign_up", layout: "./layouts/standard"})
});

app.post("/sign_up", (req, res) =>{

   const { username, email, password, password_2 } = req.body;
    let errors = [];

//    if(!username || !email || !password || !password_2 ) {
//        errors.push({ msg: "Please fill in all fields" });
//    }

//    if(password !== password_2 ) {
//        errors.push({ msg: "Passwords do not match" });
//    }

//    if(password.length < 6 ) {
//        errors.push({ msg: "Password should be at least 6 characters " });
//    }

//    if(errors.length > 0) {
//        res.render("sign_up", {

//        });

//    } else {
//        res.send("pass");
//    }

   User.findOne({ email }, (err, user) => {
    if(user) {
        console.log("email in gebruik")
        // errors.push({ msg: "Email is al gerigistreerd" });
        res.render("sign_up", {
            title: "sign_up", layout: "./layouts/profile_forms_country",
            errors,
            name: username,
            email,
            password,
            password_2
        });
    } else {
        const nieuwe_gebruiker = new User({
            name: username,
            email,
            password,
            password_2
        });

        console.log(nieuwe_gebruiker);

        bcrypt.genSalt(10, (err, salt) => 
            bcrypt.hash(nieuwe_gebruiker.password, salt, (err,hash) => {
                if(err) throw err;

                //Wachtwoord daadwerkelijk aanmaken
                nieuwe_gebruiker.password = hash;

                //gebruiker opslaan
                nieuwe_gebruiker.save()
                .then(user => {
                    // req.flash("success_msg", "You are now registered and can log in");
                    res.redirect("/log_in");
                    console.log("nieuwe gebruiker aangemaakt");
                })
                .catch(err => console.log(err));
        }))
      }
    });
});

// Inloggen
app.post("/log_in", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log_in",
        failureFlash: false
    })(req, res, next);
});

// Uitloggen
app.get("/sign_up", (req, res) => {
    req.logout();
    console.log("Uitgelogd");
    res.redirect("/log_in");
});

module.exports = router;





app.get("/log_in", (req, res) => {
    res.render("log_in", { title: "log_in", layout: "./layouts/standard"})
});


app.get("/collection", (req, res) => {
    res.render("collection", { title: "collection", layout: "./layouts/collection_detail"})
})

app.get("/profile", (req, res) => {
    res.render("profile", { title: "profile", layout: "./layouts/include_nav"})
})


app.get("/profile_overview", (req, res) => {
    res.render("profile_overview", { title: "profile_overview", layout: "./layouts/profile_forms", email: req.user.email });
})


app.get("/profile_password", (req, res) => {
    res.render("profile_password", { title: "profile_password", layout: "./layouts/profile_forms"});
})


app.get("/profile_country", (req, res) => {
    res.render("profile_country", { title: "profile_country", layout: "./layouts/profile_forms_country"});
})


















