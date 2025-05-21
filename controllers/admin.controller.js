import User from '../model/user.model.js'

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password -__v')
        res.status(200).json({ success: true,message:"Users fatched successfully", users })

    } catch (error) {
        res.status(500).json({ success:false, message: 'Internal server error' })
    }
}

export const deleteUser = async (req,res) => {
    try {
        const userId = req.params.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if(!deletedUser){
            res.status(500).json({success:false,message :'User Not Found'});
        }
        res.status(200).json({success:true,message:'User Deleted Successfully',data:deleteUser})
    
    
    
    } catch (error) {
        res.status(500).json({ success:false, message: 'Internal server error' })
    }

}

export const authentacitedAdmin = (req,res) => {
    res.status(200).json({success:true,message:'Admin Authenticated Successfully'});
}