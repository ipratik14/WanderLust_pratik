if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
console.log(process.env.SECRET);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("../WanderLust/models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
// const{listingSchema,reviewSchema}=require("./schema.js");
// const Review=require("../WanderLust/models/review.js");
// const cookieParser=require("cookie-parser");

const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");


const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const dbUrl=process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(dbUrl);
    
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


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"mysecretcode"
    },
    touchAfter:24*3600,
    
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});


const sessionOptions={
    store,
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};


// app.get("/",(req,res)=>{
  
//     res.send("Im rOOt");
//     });
    





// app.use(cookieParse());
app.use(session(sessionOptions));
app.use(flash());

//for implementing passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

//demo user for authentication
app.get("/demouser",async (req,res)=>{
   let fakeUser=new User({
    email:"email@gmail.com",
    username:"abcd"
   });

   let registerUser=await User.register(fakeUser,"helloworls");
   res.send(registerUser);
});







//use instead of listings routes
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


//COOKIES
app.get("/getcookies",(req,res)=>{
   
    res.cookie("new","cookies");
    res.send("hello");

});






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




// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"page not found"));
// });

//MIDDLEWARE
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("errors.ejs",{message});
})




app.listen(8080,()=>{
    console.log("server listining on port 8080");
});