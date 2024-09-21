const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true};

app.use(session(sessionOptions));
app.use(flash());


app.use((req,res,next)=>{
    res.locals.succMsg=req.flash("success");
    res.locals.errMsg=req.flash("error");
    next();
});


app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.session.name=name;
    // res.send(name);

    if(name==="anonymous"){
       req.flash("error","user not registered");
    }else{
        req.flash("success","user registerd successfully");
    }
   
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    // res.send(`hello ,${req.session.name}`);
    // res.locals.succMsg=req.flash("success");
    // res.locals.errMsg=req.flash("error");
    res.render("page.ejs",{name:req.session.name});
})


//  app.get("/reqcount",(req,res)=>{
//         if(req.session.count){
//             req.session.count++;
//         }else{
//             req.session.count=1;
//         }
    
//         res.send(`you send request ${req.session.count} tmes`);
//  });






// app.get("/test",(req,res)=>{
//     res.send("test successful");
// });

app.listen(3000,()=>{
    console.log("server is lietening on port 3000");
});
