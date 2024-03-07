import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import doctorRoute from "./Routes/doctor.js";
import reviewRoute from "./Routes/review.js";
import bodyParser from 'body-parser';
import bookingRoute from './Routes/booking.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000

const corsOptions = {
    origin:true
}

app.get('/',(req,res)=>{
    res.send('Hello ji')
})

//database CoNNECTION
mongoose.set('strictQuery', false);
const connectDB = async ()=>{
    try{
    await mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log(`Database connected Successfully`);

    } catch(error){
        console.log(`Database connection Failed`,error.message);
    }
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/doctors', doctorRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/bookings', bookingRoute);

app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server is running at PORT ${PORT}`);
})