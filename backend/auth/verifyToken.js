import jwt from 'jsonwebtoken';
import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';

export const authenticate = async (req, res, next)=> {
    try {
        //get token from headers
        const authToken = req.headers.authorization;

        //check token is exists
        if(!authToken || !authToken.startsWith('Bearer')){
            return res.status(401).json({
                success:false,
                message:'No token, authorization denied'
            });
        }

        const token = authToken.split(" ")[1];

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;
        req.role = decoded.role;

        
        next();
        
    } catch (error) {
        
        if( error.name === 'TokenExpiredError'){
            return res.status(401).json({
                success:false,
                message:'Token is expired',
            });
        }

        return res.status(401).json({
            success:false,
            message:`Invalid token i.e. Can't validate token ${error.message} `,
        });
    }
};

export const restrict = (roles)=> async(req, res, next)=>{
    try {
        const userId = req.userId;

        let user;

        const patient = await User.findById(userId);
        const doctor = await Doctor.findById(userId);

        if(patient){
            user = patient;
        }
        if(doctor){
            user = doctor;
        }

        if(!roles.includes(user.role)){
            return res.status(401).json({
                success:false,
                message:'You are not authorized to access'
            });
        }

        next();
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`Error while authorization ${error.message} `,
        });
    }
}