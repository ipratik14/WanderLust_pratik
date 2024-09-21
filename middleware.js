const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const{listingSchema,reviewSchema}=require("./schema.js");
const review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect URL save
        req.session.rediectUrl=req.originalUrl;
        req.flash("error","you not logged in first log in");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you dont have permission");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


//MIDDLEWARE SERVER SIDE VALIDATION
module.exports.validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}



//MIDDLEWARE SERVER SIDE VALIDATION FOR REVIEWS
module.exports.validateReviews=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
}



module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let listing=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you dont have permission");
        return res.redirect(`/listings/${id}`);
    }

    next();
};