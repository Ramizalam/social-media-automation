import mongoose from 'mongoose';
const accountSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},   
    platform:{type: String,enum:["twitter","linkedin","facebook","instagram","X"],required:true},
    handle:{type:String, required: true},
    zernioAccountId :{type: String},
    accessToken :{type:String},
    refreshToken:{type:String},
    tokenExpiresAt:{type:Date},
    status: {type:String,enum:["connected","disconnected","error"], default: "disconnected"},
    avatarUrl : {type:String}
},{timestamps:true})

export const Account = mongoose.model('Account',accountSchema)