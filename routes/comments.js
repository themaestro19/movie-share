var express = require("express");
var router = express.Router();
var movieDB = require("../models/movieRating");
var Comment = require("../models/comment");
var middleware = require("../middleware");
// ===================
// COMMENTS ROUTES
//====================

router.get("/moviepage/:id/comments/new", middleware.isLoggedIn, function(req, res){
    //find movie by id
    movieDB.findById(req.params.id, function(err, moviepage){
        if(err){
            console.log(err);
        }else {
            res.render("comments/new", {moviepage: moviepage});
        }
    })
    
});

router.post("/moviepage/:id/comments", function(req, res){
    //find movie by id
    movieDB.findById(req.params.id, function(err, moviepage){
        if(err){
            console.log(err);
            res.redirect("/moviepage");
        }else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                   console.log(err); 
                }else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    moviepage.comments.push(comment);
                    moviepage.save();
                    console.log(comment);
                    req.flash("success", "Successfully added comment");
                    res.redirect('/moviepage/' + moviepage._id);
                }
            });
        }
    });
    
});

router.get("/moviepage/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else {
            res.render("comments/edit", {moviepage_id: req .params.id, comment: foundComment});
        }
    });
    
});

// COMMENT UPDATE
router.put("/moviepage/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else {
            res.redirect("/moviepage/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/moviepage/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else {
            req.flash("success", "Comment delete");
            res.redirect("/moviepage/" + req.params.id);
        }
    });
});



module.exports = router;