const Trail = require('./models/trails');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        return res.redirect('/login');
     }
     next();
}
     
     
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const trail = await Trail.findById(id);
    if(!trail.author.equals(req.user._id)){
        req.flash('success','permission denied to edit this trail');
        res.redirect(`/hikeTrails/${trail._id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId } = req.params;
    console.log(reviewId);
    const review = await Review.findById(reviewId);
    console.log(review);
    if(!review.author.equals(req.user._id)){
        req.flash('success','permission denied to edit this review');
        res.redirect(`/hikeTrails/${id}`);
    }
    next();
}


