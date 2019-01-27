var express = require("express");
var router = express.Router();
var movieDB = require("../models/movieRating");
var middleware = require("../middleware");

//INDEX - Show all Movie
router.get("/moviepage", function(req, res){

   if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
     // Get all movie from DB
     movieDB.find({name: regex}, function(err, allMovie){
        if(err){
            console.log(err);
        }else {
            res.render("moviePage/index",{moviepage: allMovie, currentUser: req.user});
        }
    });
   }else {

   
    // Get all movie from DB
    movieDB.find({}, function(err, allMovie){
            if(err){
                console.log(err);
            }else {
                res.render("moviePage/index",{moviepage: allMovie, currentUser: req.user});
            }
        });
    }   
});

//CREATE - Add new Movie
router.post("/moviepage", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newMovie = {name: name, image: image, description: desc, author: author}
    console.log(req.user);
    movieDB.create(newMovie, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else {
            console.log(newlyCreated);
            res.redirect("/moviepage");
        }
    })
});

//NEW - Show Form to Create  new Movie
router.get("/moviepage/new", middleware.isLoggedIn, function(req, res){
    res.render("moviePage/new");
});

// SHOW --show more info about newMovie
router.get("/moviepage/:id", function(req, res){
    movieDB.findById(req.params.id).populate("comments").exec(function(err, foundMovie){
        if(err){
            console.log(err);
        }else{
            console.log(foundMovie);
            res.render("moviePage/show",{moviepage: foundMovie}); 
        }
    })            
});

// EDIT MOVIERATING ROUTE
router.get("/moviepage/:id/edit", middleware.checkMovieOwnership, function(req, res){  
        movieDB.findById(req.params.id, function(err, foundMovie){
            res.render("moviePage/edit", {moviepage: foundMovie});             
    });
});
// UPDATE MOVIERATING ROUTE
router.put("/moviepage/:id", middleware.checkMovieOwnership, function(req, res){
    movieDB.findByIdAndUpdate(req.params.id, req.body.moviepage, function(err, updatedMovie){
        if(err){
            console.log(err);
            res.redirect("/moviepage");
        }else {
            res.redirect("/moviepage/" + req.params.id);
        }
    });
}); 

// DESTROY MOVIE ROUTE
router.delete("/moviepage/:id", middleware.checkMovieOwnership, function(req, res){
    movieDB.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/moviepage");
        }else {
            res.redirect("/moviepage");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;