const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {validateReviews, isLoggedIn, isReviewAuthor}=require("../middleware.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");

const reviewController=require("../controller/review.js");






//REVIEWS
//POST REVIEW ROUTE
router.post("/",validateReviews,isLoggedIn,wrapAsync(reviewController.postReviews));
  
  
  //DELETE REVIEW ROUTE
  router.delete("/reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReviews));


  module.exports=router;
  