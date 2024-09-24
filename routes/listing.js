const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../models/listing.js");
const{isLoggedIn,isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controller/listing.js");

const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage }); 



//need implement router.route here for better code composition ,
//  but for understannding I am not doing that



//INDEX ROUTE
router.get("/",wrapAsync(listingController.index));
 
 
// NEW FORM ROUTE
 router.get("/new",isLoggedIn,listingController.newForm);
 
 
  //SHOW ROUTE
  router.get("/:id",wrapAsync(listingController.showListing));
 
 
  //CREATE ROUTE
//  router.post("/",upload.single("listing[image]"),(req,res)=>{
//    res.send(req.file);
//  });
router.post("/",upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));
 
//  isLoggedIn,validateListing ,
//     wrapAsync(listingController.createListing));
  
 
 //EDIT ROUTE
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editRoute));
 
 
 //UPDATE ROUTE
 router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateRoute));
 
 //DELETE ROUTE
 router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyRoute));


 module.exports=router;