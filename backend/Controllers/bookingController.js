import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import Booking from '../models/BookingSchema.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay';

export const getCheckoutSession = async(req,res)=>{
    try {
        
        //get currently booked doctor
        const doctor = await Doctor.findById(req.params.doctorId);
        const user = await User.findById(req.userId);

        const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY,
                key_secret: process.env.RAZORPAY_SECRET,
        });

        const price = doctor.ticketPrice;

        // setting up options for razorpay order.
        const options = {
                amount: price*100,
                currency: 'INR',
                receipt: Math.random(Date.now()).toString(),
                payment_capture: 1
        };

        const response = await razorpay.orders.create(options);

        //create new booking
        
        const booking = new Booking({
            doctor:doctor._id,
            user:user._id,
            ticketPrice:doctor.ticketPrice
        });

        await booking.save();

        return res.status(200).json({
            success:true,
            message:'Successfully Paid',
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
            data:response,
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Error while creating order'
        });
    }
}