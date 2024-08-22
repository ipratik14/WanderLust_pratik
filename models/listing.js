const mongoose=require("mongoose");
const Schema=mongoose.Schema;

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

const Listing=mongoose.model("Listing", listingSchema);
module.exports=Listing;