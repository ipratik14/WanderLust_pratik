const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");


const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        default:"https://unsplash.com/photos/a-shadow-of-a-palm-tree-on-the-side-of-a-house-Quc1f1T-HHs",
        type:String,
        set:(v)=> v==="" ? "https://unsplash.com/photos/a-shadow-of-a-palm-tree-on-the-side-of-a-house-Quc1f1T-HHs":v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
});


listingSchema.post("findOneAndDelete",async(listing)=>{

    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
    
});







const Listing=mongoose.model("Listing", listingSchema);
module.exports=Listing;