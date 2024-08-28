const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const{reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");



//MIDDLEWARE SERVER SIDE VALIDATION FOR REVIEWS
const validateReviews=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,result.error);
    }else{
        next();
    }
}







//REVIEWS
//POST REVIEW ROUTE
router.post("/",validateReviews,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
  
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
  
  //   console.log("new review saved");
  //   res.send("new review saved")
       
  res.redirect(`/listings/${listing._id}`)
  
  }));
  
  
  //DELETE REVIEW ROUTE
  router.delete("/reviewId",wrapAsync(async(req,res)=>{
      let{id,reviewId}=req.params;
  
      await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
      await Review.findByIdAndDelete(reviewId);
  
      res.redirect(`/listings/${id}`);
  }));


  module.exports=router;
  