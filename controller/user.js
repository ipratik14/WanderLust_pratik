const User=require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signUp=async(req,res)=>{
    try{
       let{username,email,password}=req.body;
       const newUser=new User({email,username});
       const regUser= await User.register(newUser,password);
       console.log(regUser);
       //for direct login after sighup
       req.login(regUser,(err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","welcome to wanderlust");
        res.redirect("/listings");
       });
       
    }catch(e){
       req.flash("error",e.message);
       res.redirect("/signup");
    }

}

module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login=async (req,res)=>{
    req.flash("success","Welcome back");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
 }

 module.exports.logOut=(req,res)=>{
    req.logout((err)=>{
       if(err){
          return next(err);
       }
       req.flash("success","logged you out!!");
       res.redirect("/listings");
    });
 }