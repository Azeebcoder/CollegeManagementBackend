import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    rollNo:{
        type:Number,
        required:true
    },
    verifyOtp:{
        type:String,
        default:''
    },
    verifyOtpExpiresAt:{
        type:Date,
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        default:'User'
    },
    course:{
        type:String
    },
    semester:{
        type:String
    },
    city:{
        type:String
    },
    college:{
        type:String
    }
},{timestamps:true});
const userModel = mongoose.model.Users || mongoose.model('User',userSchema);

export default userModel