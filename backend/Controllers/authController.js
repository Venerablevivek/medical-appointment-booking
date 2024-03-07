import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (user) =>{
    return jwt.sign({
        id:user._id,
        role:user.role
    },process.env.JWT_SECRET, {
        expiresIn: "200d",
    })
}

export const register = async(req,res)=>{
    try {
        const {email, password, name, role, photo, gender} = req.body;

        // email validation
        if(!email && !password && !role ){
            return res.status(400).json({
                success:false,
                message:"Some fields are mandatory, Fill that and TRY AGAIN "
            })
        }

        let user = null;

        // validation if already exist or not
        if(role === 'patient'){
            user = await User.findOne({email});
        }else if(role === 'doctor' ){
            user = await Doctor.findOne({email});
        }

        if(user){
            return res.status(400).json({
                success:false,
                message:'User already Exist'
            })
        }

        //HASH PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        if(role === 'patient' ){
            user = await User.create({
                name,
                email,
                password:hashPassword,
                photo,
                gender,
                role
            })
        }

        if(role === 'doctor' ){
            user = await Doctor.create({
                name,
                email,
                password:hashPassword,
                photo,
                gender,
                role
            })
        }

        // await user.save()

        res.status(200).json({
            success:true,
            message:'User Created Successfully ',
            data:user
        });
         
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:`Signup Failure, Cannot create User ${error.message} `,
        });
    }
}

export const login = async(req,res)=>{
    try {
        const {email, password} = req.body;

        if(!email && !password){
            return res.status(400).json({
                success:false,
                message:"All fields are mandatory "
            })
        }

        let user = null;

        const patient = await User.findOne({email});
        const doctor = await Doctor.findOne({email});

        if(patient){
            user = patient;
        }
        if(doctor){
            user = doctor;
        }

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'No user Found'
            })
        }

        //Decrypt and match hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid Password"
            });
        }

        //get token
        const token = generateToken(user);

        const {Password, role, appointments, ...rest} = user._doc

        res.status(200).json({
            success:true,
            message:'Successfully Login',
            token: token,
            data:{...rest}, 
            role
        });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:`Cannot Login, Please Try Again ${error.message}`,
        });
    }
}