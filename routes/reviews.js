const express = require('express');
const { builtinModules } = require('module');
const router = express.Router({ mergeParams:true });
const { isLoggedIn, isReviewAuthor } = require('../middleware');
const Trail = require('../models/trails');
const Review = require('../models/review');

router.post('/',isLoggedIn , async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    trail.reviews.push(review);
    await review.save();
    await trail.save();
    req.flash('success','review added successfully')
    res.redirect(`/hikeTrails/${trail._id}`);
    
 })
 
 router.delete('/:reviewId', isLoggedIn,isReviewAuthor, async (req, res) => {
    const {id, reviewId} = req.params;
    await Trail.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId)
    req.flash('success','review deleted successfully')
    res.redirect(`/hikeTrails/${id}`)
 })

 module.exports = router;
 