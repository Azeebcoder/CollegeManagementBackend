import userModel from '../model/user.model.js'

export const getUserInfo = async (req,res) => {
    const {userId} = req.user;
    if(!userId){
        return res.status(201).json({success:false,message:"login First"});
    }
    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(201).json({success:false,message:"User not found"});
        }
        res.status(200).json({
            username:user.username,
            email:user.email,
            course:user.course,
            semester:user.semester,
            city:user.city,
            college:user.college
        })
    } catch (error) {
        res.status(400).json({success:false,message:error.message})
    }
}

export const updateUserInfo = async (req,res) => {
    const {userId} = req.user;
    if(!userId){
        return res.status(201).json({success:false,message:"login First"});
    }
    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(201).json({success:false,message:"User not found"});
        }
        const {username,course,semester,city,college} = req.body;
        if(!username ||!course || !semester || !city || !college){
            return res.status(201).json({success:false,message:"Please fill all the fields"});
        }
        const updatedUser = await userModel.findByIdAndUpdate(userId,{
            username,
            course,
            semester,
            city,
            college
        },{new:true});
        if(!updatedUser){
            return res.status(201).json({success:false,message:"User not found"});
        }   
        res.status(200).json({
            success:true,
            message:"User updated successfully",
            user:{
                name:updatedUser.username,
                course:updatedUser.course,
                semester:updatedUser.semester,
                city:updatedUser.city,
                college:updatedUser.college
            }
        })
    }
    catch (error) {
        res.status(400).json({success:false,message:error.message})
    }
}