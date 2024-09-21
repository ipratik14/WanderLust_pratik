const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true    
    }
});


//automatically implement password,hashing,salting
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema);