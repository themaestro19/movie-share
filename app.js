var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var movieDB = require("./models/movieRating");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
var commentRoutes = require("./routes/comments");
var movieRoutes = require("./routes/movieRatings");
var indexRoutes = require("./routes/index");
var flash = require("connect-flash");
var keys = require("./config/keys");


mongoose.connect(keys.mongoURI);
//mongoose.connect("mongodb://localhost:27017/movieDB", {useNewUrlParser: true}); //mongodb://admin:admin1234@ds113845.mlab.com:13845/moviedb
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

// PASSPORT CONFOGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(movieRoutes);
app.use(commentRoutes);

app.listen(3500, () => {
    console.log("MOVIE RATING!!!!!!");
});

