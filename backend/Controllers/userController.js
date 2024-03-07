import User from '../models/UserSchema.js';
import Booking from '../models/BookingSchema.js';
import Doctor from '../models/DoctorSchema.js'

export const updateUser = async(req,res)=>{
    try {
        const id = req.params.id;

        const updatedUser = await User.findByIdAndUpdate(id, {
            $set:req.body}, 
            {new:true});
        
        res.status(200).json({
            success:true,
            message:'User Updated Successfully ',
            data:updatedUser
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:`Cannot Update User ${error.message} `
        })
    }
}

export const deleteUser = async(req,res)=>{
    try {
        const id = req.params.id;

        await User.findByIdAndDelete(id);
        
        res.status(200).json({
            success:true,
            message:'User Deleted Successfully '
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:`Cannot Delete User ${error.message} `
        })
    }
};

export const getSingleUser = async(req,res)=>{
    try {
        const id = req.params.id;

        const response =  await User.findById(id).select("-password");
        
        res.status(200).json({
            success:true,
            message:'User Found Successfully',
            data:response
        })
        
    } catch (error) {
        res.status(404).json({
            success:false,
            message:`Cannot Found User ${error.message} `
        })
    }
};

export const getAllUser = async(req,res)=>{
    try {

        const users =  await User.find({}).select("-password");
        
        res.status(200).json({
            success:true,
            message:'All Users Found Successfully',
            data:users
        });
        
    } catch (error) {
        res.status(404).json({
            success:false,
            message:`Cannot Found Users ${error.message} `
        });
    }
};

export const getUserProfile = async(req,res)=>{
    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success:false,
                message:'User not found',
            });
        }
        
        const {password, ...rest} = user._doc;

        return res.status(200).json({
            success:true,
            message:'Profile info is getting',
            data:{...rest},
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:`Cannot Found User Profile ${error.message} `
        });
    }
};

export const getMyAppointments = async(req,res)=>{
    try {

        //retirieve appointments from booking for specific user
        const bookings = await Booking.find({user:req.userId});

        //extract doctor ids from appointment bookings
        const doctorIds = bookings.map(el=>el.doctor.id);

        //retrieve doctors using doctor ids
        const doctors = await Doctor.find({_id: {$in:doctorIds}}).select('-password');

        return res.status(200).json({
            success:true,
            message:'Appointments fetched Successfully',
            data:doctors
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:`Cannot get Appointments, something went wrong ${error.message} `
        });
    }
};