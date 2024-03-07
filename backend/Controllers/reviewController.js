import Review from '../models/ReviewSchema.js';
import Doctor from '../models/DoctorSchema.js';

//get all reviews
export const getAllReviews = async (req, res) =>{
    try {
        const reviews = await Review.find({});

        return res.status(200).json({
            success:true,
            message:'Successfully fetched all reviews',
            data:reviews
        });
    } catch (error) {
        return res.status(500).json({
            success:true,
            message:`Failed to fetch all the reviews ${error.message} `
        });
    }
}

//create review
export const createReview = async(req, res)=>{
    try {
        if(!req.body.doctor) req.body.doctor = req.params.doctorId
        if(!req.body.user) req.body.user = req.userId

        const newReview = await Review(req.body);

        const savedReview = await newReview.save();

        await Doctor.findByIdAndUpdate(req.body.doctor, {
            $push: {
                reviews: savedReview._id,
            }
        });

        return res.status(200).json({
            success:true,
            message:'Review Submitted Successfully ',
            data:savedReview
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`Review cannot Submitted because ${error.message} `
        })
    }
}