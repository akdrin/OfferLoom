const userModel= require('../models/user.model')
const tokenblacklistModel=require('../models/blacklist.model')
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')
/**
 * @name registerUserController
 * @description Register a new User,expects username,email and password
 * @access Public
 */

async function registerUserController(req,res){
    const {username ,email ,password}= req.body

    if(!username || !password || !email){
        return req.status(400).json({
            message: "Please provide username,email and password"
        })
    }

    const isUserAlreadyExist= await userModel.findOne({
        $or: [{username},{email}]
    })

    if(isUserAlreadyExist){
        return req.status(400).json({
            message: "Account already exist with this email or Username"
        })
    }
    const hash= await bcrypt.hash(password,10)

    const user= await userModel.create({
        username,
        email,
        password: hash
    })

    const token= jwt.sign(
        {id: user._id ,username: user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)
    res.status(201).json({
        message: "User registered sucessfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name loginUserController
 * @description Login a user,expects Username and password in the req body
 * @access Public
 */

async function loginUserController(req,res){
    const {username, password} =req.body
    const user=await userModel.findOne({username})
    if(!user){
        return req.status(400).json({
            message: "Invalid Username or Password"
        })
    }
    const isPasswordValid= bcrypt.compare(password , user.password)

    if(!isPasswordValid){
        return req.status(400).json({
            message: "Invalid Username or Password"
        })
    }

    const token = jwt.sign(
        {id: user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
    res.cookie("token",token)
    res.status(200).json({
        message:"User LoggedIn sucessfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * 
 * @name logoutUserController
 * @description remove token from cookie and add to blacklist
 * @access public
 */

async function logoutUserController(req,res){
    const token= req.cookies.token
    if(token){
        await tokenblacklistModel.create({token})
    }
    res.clearCookie("token")
    res.status(200).json({
        message:"User logged out successfully"
    })
}

/**
 * 
 * @name getMeController
 * @description get the current logged in user details
 * @access private
 */
async function getMeController(req,res){
    const user=await userModel.findById(req.user.id)
    res.status(200).json({
        message:"User details fetched sucessfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}
module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}