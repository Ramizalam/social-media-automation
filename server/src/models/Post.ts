import mongoose  from "mongoose";

const postSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId , ref:"Account",required:true},
    content: {type: String, required: true},
    mediaUrl : {type: String},
    mediaType: {type: String ,enum : ["image","video","none"]},
    platform : [{type: String, enum : ["instagram","twitter","facebook" ,"X"]}],
    scheduledFor : {type: Date,required : true},
    status : {type:String, enum : ["draft","scheduled","published","failed"],default:"scheduled"},   
},{timestamps:true})

export const Post = mongoose.model("Post",postSchema)