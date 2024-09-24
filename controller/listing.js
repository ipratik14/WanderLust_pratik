const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    const allListings =  await Listing.find({});
    res.render("listings/index.ejs",{allListings});
  };

module.exports.newForm=(req,res)=>{
    res.render("listings/new.ejs");
  };

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",populate:{
       path:"author",}
   })
    .populate("owner");
    if(!listing){
       req.flash("error","listing you requested not exists!!!");
       res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});

 }

//  module.exports.createRoute=async (req,res,next)=>{
//     // let {title,description,image,price,country,locatiion}=req.body;
       
//         const newListing= new Listing(req.body.listing);
//         newListing.owner=req.user._id;
//         await newListing.save();
//         req.flash("success","new listing created");
//         res.redirect("/listings");
    
// }

module.exports.createListing=async(req,res,next)=>{
    
        

        

    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url, "..", filename);
    const newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};

   

    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.editRoute=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
       req.flash("error","listing you requested not exists!!!");
       res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}

module.exports.updateRoute=async(req,res)=>{
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   req.flash("success"," listing updated");
   res.redirect(`/listings/${id}`);
}

module.exports.destroyRoute=async (req,res)=>{
    let {id}=req.params;
    let deleteListing= await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success"," listing deleted");
    res.redirect("/listings");
}