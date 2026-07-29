import mongoose form 'mongoose'
const accountSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},   
    platform:{type: String,enum:["twitter,linkedin"]}
    zernioProfileID:{type:String},
    zernioRefreshToken:{type:String},
    
})

export const Account = mongoose.model('Account',accountSchema)