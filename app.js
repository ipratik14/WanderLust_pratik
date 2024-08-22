const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("../WanderLust/models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const{listingSchema,reviewSchema}=require("./schema.js");
const Review=require("../WanderLust/models/review.js");

const listings=require("./routes/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res)=>{
res.send("Im rOOt");
});


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


//use instead of listings routes
app.use("/listings",listings);






//REVIEWS
//POST ROUTE
app.post("/listings/:id/review",validateReviews,wrapAsync(async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

//   console.log("new review saved");
//   res.send("new review saved")
     
res.redirect(`/listings/${listing._id}`)

}));




// app.get("/testlisting",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new villa",
//         description:"by the beach",
//         price:1200,
//         location:"manmar",
//         country:"south west",
//     });

//     await sampleListing.save();
//     console.log("ample was saved");
//     res.send("succcessful");
    
// })




app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

//MIDDLEWARE
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("errors.ejs",{message});
})




app.listen(8080,()=>{
    console.log("server listining on port 8080");
});