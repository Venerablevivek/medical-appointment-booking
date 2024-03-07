import Doctor from '../models/DoctorSchema.js';
import Booking from '../models/BookingSchema.js';

export const updateDoctor = async(req,res)=>{
    try {
        const id = req.params.id;

        const updatedDoctor = await Doctor.findByIdAndUpdate(id, {
            $set:req.body}, 
            {new:true});
        
        res.status(200).json({
            success:true,
            message:'Doctor Updated Successfully ',
            data:updatedDoctor
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:`Cannot Update Doctor ${error.message} `
        })
    }
}

export const deleteDoctor = async(req,res)=>{
    try {
        const id = req.params.id;

        await Doctor.findByIdAndDelete(id);
        
        res.status(200).json({
            success:true,
            message:'Doctor Deleted Successfully '
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:`Cannot Delete Doctor ${error.message} `
        })
    }
};

export const getSingleDoctor = async(req,res)=>{
    try {
        const id = req.params.id;

        const response =  await Doctor.findById(id).populate("reviews").select("-password");
        
        res.status(200).json({
            success:true,
            message:'Doctor Found Successfully',
            data:response
        })
        
    } catch (error) {
        res.status(404).json({
            success:false,
            message:`Cannot Found Doctor ${error.message} `
        })
    }
};

export const getAllDoctor = async(req,res)=>{
    try {

        const {query} = req.query;
        var doctors;

        if(query){
            doctors = await Doctor.find({
                isApproved: 'approved',
                $or:[{name: {$regex: query, $options: "i"}},
                     {specialization: {$regex: query, $options: "i"}}
            ],
            }).select("-password");
        }else{
             doctors =  await Doctor.find({isApproved: 'approved'}).select("-password");
        }
        
        res.status(200).json({
            success:true,
            message:'All Doctors Found Successfully',
            data:doctors
        });
        
    } catch (error) {
        res.status(404).json({
            success:false,
            message:`Cannot Found Doctors ${error.message} `
        });
    }
};

export const getDoctorProfile = async(req,res)=>{
    try {
        const doctorId = req.userId;
        const doctor = await Doctor.findById(doctorId);
       
        if(!doctor){
            return res.status(404).json({
                success:false,
                message:'Doctor not found',
            });
        }
        
        const {password, ...rest} = doctor._doc;
        const appointments = await Booking.find({doctor:doctorId});

        return res.status(200).json({
            success:true,
            message:'Profile info is getting',
            data:{...rest, appointments},
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:`Cannot Found Doctor Profile ${error.message} `
        });
    }
}