var middlewareObj = {};
var movieDB = require("../models/movieRating");
var Comment = require("../models/comment")

middlewareObj.checkMovieOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            movieDB.findById(req.params.id, function(err, foundMovie){
                if(err){
                    req.flash("error", "Movie not Found");
                    res.redirect("back");
                }else {
                    if(foundMovie.author.id.equals(req.user._id) || req.user.isAdmin){
                        next(); 
                    }else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }        
                }
            });
        }else {
           res.redirect("back");
        }      
    }


middlewareObj.checkCommentOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundCcomment){
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else {
                    if(foundCcomment.author.id.equals(req.user._id) || req.user.isAdmin){
                        next(); 
                    }else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }        
                }
            });
        }else {
            req.flash("error", "Please Login first");
            res.redirect("back");
        }      
    }
    
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login first");
    res.redirect("/login");
}


module.exports = middlewareObj;