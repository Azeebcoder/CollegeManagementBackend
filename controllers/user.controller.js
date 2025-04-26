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