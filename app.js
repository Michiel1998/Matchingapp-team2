

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const mongoose = require("mongoose");
const toId = mongoose.Types.ObjectId;

const app = express();

//Passport configuratie
require("./config/passport")(passport);

require("dotenv").config();

// Mongoose
const dbURI = process.env.dbURI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Verbonden met de database");
});

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Sessions
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

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
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.info(`App listening on port ${PORT}`));

const router = express.Router();
const { ensureAuthenticated } = require("./config/auth");

const bcrypt = require("bcryptjs");

// Gebruikers
const User = require("./models/gebruikers");

const getBars = async () => {
  const bars = await Bars.find();

  return bars;
};

const getLikedBars = async () => {
  const likedBars = await LikedBars.find();

  return likedBars;
};

// Barren en pubs
const Bars = require("./models/bars");
const LikedBars = require("./models/likedBars");
const { type } = require("express/lib/response");
const { deleteOne } = require("./models/gebruikers");

// Express Layouts
app.set("layout", "./layouts/standard");

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "for_you",
    layout: "./layouts/include_nav",
  });
});


app.get("/welcome", (req, res) => {
  res.render("welcome", { title: "welcome", layout: "./layouts/standard" });
});

app.get("/sign_up", (req, res) => {
  res.render("sign_up", { title: "sign_up", layout: "./layouts/standard" });
});

app.post("/sign_up", (req, res) => {
  const { username, email, password, password_2 } = req.body;
  let errors = [];

  
  // Aanmaken van ingevuld emailadres
  User.findOne({ email }, (err, user) => {
    if (user) {
      console.log("email in gebruik");
      // Gebruiker naar registreren sturen als emailadres in gebruik is
      res.render("sign_up", {
        title: "sign_up",
        layout: "./layouts/profile_forms_country",
        errors,
        name: username,
        email,
        password,
        password_2,
      });
    } else {
      // Gebruiker registreren in database
      const nieuwe_gebruiker = new User({
        name: username,
        email,
        password,
        password_2,
      });

      console.log(nieuwe_gebruiker);

      // Ingevoerde wachtwoord van gebruiker versleutelen
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(nieuwe_gebruiker.password, salt, (err, hash) => {
          if (err) throw err;

          // Wachtwoord daadwerkelijk aanmaken
          nieuwe_gebruiker.password = hash;

          // gebruiker opslaan
          nieuwe_gebruiker
            .save()
            .then((user) => {
              // req.flash("success_msg", "You are now registered and can log in");
              res.redirect("/log_in");
              console.log("nieuwe gebruiker aangemaakt");
            })
            .catch((err) => console.log(err));
        })
      );
    }
  });
});

// Inloggen
app.post("/log_in", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/discover",
    failureRedirect: "/log_in",
    failureFlash: false,
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
  res.render("log_in", { title: "log_in", layout: "./layouts/standard" });
});


app.get("/cocktails", (req, res) => {
  res.render("cocktails", { title: "cocktails", layout: "./layouts/standard" });
});

app.get("/profile", (req, res) => {
  res.render("profile", { title: "profile", layout: "./layouts/include_nav" });
});

//hier begint de functie liken >>>>>>>>

app.get("/discover", async (req, res) => {
  try {
    // 1. Haal alle barren uit de database
    getBars().then((bars) => {
      // 2. Toon alle barren in de bars pagina
      res.render("discover", {
        name: req?.user?.name || 'unknown',
        title: "discover",
        bars,
        layout: "./layouts/discover_layout",
      });
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/likes", async (req, res) => {
  try {
    // 1. Haal alle barren uit de database
    getLikedBars().then((likedBars) => {
      // 2. Toon alle barren in de bars pagina
      console.log(likedBars);

      res.render("likes", {
        title: "likes",
        likedBars,
        layout: "./layouts/discover_layout",
      });
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/discover/:_id",  async (req, res) => {
  // Find the ID of the liked Bar
  console.log("REQUEST ID:", req.params._id);
  req.params.id = toId(req.params._id);

  // Find the data object of the liked Bar in bars database
  const likedBar = await Bars.findById(req.params._id).lean();

  // Push liked bar object to likedBar database collection
  const likedBarExists = await LikedBars.findOne({ _id: req.params.id })

  if(!likedBarExists)
  {
    console.log('test')
    const barToLike = new LikedBars(likedBar);
    await barToLike.save(likedBar);
  } else {
    console.log("bjhhkjh")
    LikedBars.deleteOne({ _id: req.params.id });
  }



  // const deleteBar = await deleteOne (likedBar);

  // deleteBar.deletedCount(likedBar);


  try {
    // 1. Haal alle barren uit de database
    getLikedBars().then((likedBars) => {
      // 2. Toon alle barren in de bars pagina
      res.render("likes", {
        title: "likes",
        likedBars,
        layout: "./layouts/discover_layout",
      });
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/favorites/delete",  async (req, res) => {
  console.log('hey hij doet het tot hier')
  let test = toId(req.body.barID);

  console.log(req.body)

  // database actie zodat bar uit favorieten gaat
 const result = await LikedBars.deleteOne({ _id: test }); 
 console.log(result)

  // database actie om de nieuwe lijst met favorieten
  try {
    console.log('dfsjkl')
    // 1. Haal alle barren uit de database
    getLikedBars().then((likedBars) => {
      // 2. Toon alle barren in de bars pagina
      res.render("likes", {
        title: "likes",
        likedBars,
        layout: "./layouts/discover_layout",
      });
    });
  } catch (error) {
    console.log(error);
  }
  // render favorieten

})


  
app.get("/profile_overview", (req, res) => {
  res.render("profile_overview", {
    title: "profile_overview",
    layout: "./layouts/profile_forms",
    email: req.user.email,
  });
});

app.get("/profile_password", (req, res) => {
  res.render("profile_password", {
    title: "profile_password",
    layout: "./layouts/profile_forms",
  });
});

app.get("/profile_country", (req, res) => {
  res.render("profile_country", {
    title: "profile_country",
    layout: "./layouts/profile_forms_country",
  });
});

