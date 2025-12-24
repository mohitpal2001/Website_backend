const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const isProduction = process.env.NODE_ENV === 'production';


const registerUser = async(req,res)=>{
    const {username,password,email} = req.body;
try{
    const checkUser = await User.findOne({email})
    if(checkUser)return res.json({success: false, message:"User Already exists with the same email! please try again"});

    const hashPassword = await bcrypt.hash(password,12);
    const newUser = new User({
        username,
        email,
        password:hashPassword
    });
    await newUser.save();
    res.status(201).json({
        success:true,
        message:"User Registered Successfully"
    });

}catch(err){
console.log(err);
res.status(500).json({
    success:false,
    message:"Internal Server Error"
});
}
}


const loginUser = async(req,res)=>{
    const{email,password}=req.body
    console.log(email,password);
 try{
    const checkUser = await User.findOne({email});
    if(!checkUser){
        return res.json({success:false,message:"email does'nt exist"});
    }

    const checkhashPassword = await bcrypt.compare(password,checkUser.password)
    if(!checkhashPassword){
        return res.json({
            success:false,
            message:"User does'nt exist, please register first "
        })
    }


    const token = jwt.sign({
        id:checkUser._id,role:checkUser.role,email:checkUser.email
    },'CLIENT_SECRET_KEY',{expiresIn:'60min'})

   res.cookie('token', token, {
  httpOnly: true,
  secure: false,      
  sameSite: "lax" 
}).json({
            message:'Logged in succesfully',
        user:{
           email:checkUser.email,
           role:checkUser.role,
           id:checkUser._id,
           token:token
        }
    })
    

 }catch(err){
    console.log(err);
    res.status(500).json({
        success:false,
        message:"Internal Server Error"
    });
 }

}


const logoutUser = (req,res)=>{
    res.clearCookie('token').json({
        success:true,
        message:'Logged out successfully'
    })
}


const authMiddleware = async(req,res,next)=>{
    console.log(req.cookies.token);
    const token = req.cookies.token;

    if(!token)return res.status(401).json({
        success:false,
        message:'Unauthorised user!'
    })

    try{
        const decode = jwt.verify(token,'CLIENT_SECRET_KEY');
        req.user = decode;
        next()
    }catch{
res.status(401).json({
    success:false,
    message:"Unauthorised user!"
})
    }

}





module.exports={registerUser,loginUser,logoutUser,authMiddleware}