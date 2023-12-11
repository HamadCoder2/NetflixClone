require('dotenv').config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require("express-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();
const uri = process.env.MONGO_URI 


app.use(flash());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const store = new MongoDBStore({
 uri: process.env.MONGO_URI,
 collections: 'sessions'
});

store.on('error', function(error) {
   console.log(error);
});

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: true,
        maxAge: 5 * 24 * 60 * 60 * 1000,
    }
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(process.env.MONGO_URI, {
    writeConcern: { w: 'majority', wtimeout: 0 },
})
    .then(() => {
        console.log("Connection successfully");
    })
    .catch((err) => console.log("Connection failed:", err));


const userSchema = new mongoose.Schema({
    email: String,
    password: String,

});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.serializeUser((user, done) => {
    if (user) {
        return done(null, user.id);
    } else {
        return done(null, false);
    }
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err) {
            return done(err, user);
        } else {
            return done(null, user);
        }
    });
});

app.get("/", (req, res) => {
    res.render("index", { message: req.flash(), messages: req.flash() });
});

app.get("/signin", (req, res) => {
    res.render("signin");
});

app.get("/home", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("home", { user: req.user });
    } else {
        res.redirect("/signin");
    }
});

app.get("/tvshow", (req, res) => {
    res.render("tvshow", { user: req.user });
});

app.get("/movie", (req, res) => {
    res.render("movie", { user: req.user });
});

app.get("/new&popular", (req, res) => {
    res.render("new&popular", { user: req.user });
});

app.get("/mylist", (req, res) => {
    res.render("mylist", { user: req.user });
});

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const user = await User.findOne({ email: username }).exec();

    if (user) {
        req.flash('error', `Email is already registered. Please choose a different email.`);
        res.redirect("/");
    } else {
        res.render("setpassword", { username: username });
    }
});


app.get("/setpassword", function (req, res) {
    res.render("setpassword", { username: username });
});

app.post("/setpassword", function (req, res) {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.error(err);
            return res.redirect("/");
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/home");
            });
        }
    });
});


//  for login 
app.post("/login", function (req, res, next) {
    const user = new User({
        username: req.session.username,
        password: req.body.password
    });

    passport.authenticate("local", function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            req.flash("error", "wrong email or password");
            return res.redirect("/signin");
        }

        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect("/home");
        });
    })(req, res, next);
});



app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});


// for exit profile
app.get("/exit-profile/:email", async (req, res) => {
    const userEmailToDelete = req.params.email;

    try {
        const deletedUser = await User.findOneAndDelete({ username: userEmailToDelete }).exec();

        if (deletedUser) {
            req.flash('success', `User with email ${userEmailToDelete} deleted successfully.`);
        } else {
            req.flash('error', `User with email ${userEmailToDelete} not found.`);
        }

        res.redirect('/');
    } catch (error) {
        console.error('Error deleting user:', error);
        req.flash('error', 'Internal Server Error');
        res.redirect('/');
    }
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`server is running on ${port}.`);
});

