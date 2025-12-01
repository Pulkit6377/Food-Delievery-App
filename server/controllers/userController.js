import userModel from "../models/userModel.js";
import { OAuth2Client } from "google-auth-library";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'


// login user
const loginUser = async(req,res) =>{
    const {email,password} = req.body;
    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User Not Registered"});
        }
        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            res.json({success:false,message:"Please enter valid login credentials"})
        }

        const token = createToken(user._id);
        res.json({success:true,token})
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"This is a Error"})
    }
}

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register user
const registerUser = async(req,res) =>{
    const {name,password,email} = req.body;
    try{
        // checking is user already exist 
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false,message:"User Already Exists"})
        }

        // validating email format and strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter valid email"})
        }

        if(password.length<8){
            return res.json({success:false,message:"Password must have atleat 8 letters"})
        }

        // hashing user password

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user =  await newUser.save();
        const token = createToken(user._id)

        res.json({success:true,token});
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"This is Error"})
    }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    // Check if user exists
    let user = await userModel.findOne({ email });

    // New user → create
    if (!user) {
      user = await userModel.create({
        name,
        email,
        password: "",   // no password for google users
        avatar: picture,
        authType: "google"
      });
    }

    // Generate JWT
    const JWTtoken = createToken(user._id);

    return res.json({success: true,JWTtoken});

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Google Login failed" });
  }
};

export {loginUser,registerUser,googleLogin};