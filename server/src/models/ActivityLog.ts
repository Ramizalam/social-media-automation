import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    activityType:{type:String,enum:["POST_PUBLISHED","AI_REPLY"],required:true},
    description : {type:String,required:true},
    relatedPost:{type: mongoose.Schema.Types.ObjectId},
    platform: {type:String,},
    aiGeneratedText : {type:String}
    
},{timestamps:true})

const ActivityLog = mongoose.model("ActivityLog",activityLogSchema);
export default ActivityLog;