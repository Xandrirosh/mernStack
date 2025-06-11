const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

//@desc register new user
//@route POST /api/users
//@access public
const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('please add all fields')
    }

    //check if user exist
    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    //hashPassword
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token:generateToken(user._id, user.name),
        })
    } else {
        res.status(400)
        throw new Error('invalid user data')
    }
})

//@desc authenticate  user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res, next) => {
    const {email, password } = req.body

    //check for user email
    const user = await User.findOne({email})

    if (user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token:generateToken(user._id, user.name),
        })
    }else{
        res.status(400)
        throw new Error('invalid credentials')
    }
})

//@desc user data
//@route GET /api/users/me
//@access public
const getMe = asyncHandler(async (req, res, next) => {
    const {_id, name, email} =await User.findById(req.user.id)
    res.status(200).json({
        id:_id,
        name,
        email,
    })
    
})

//generate JWT
const generateToken = (id ,name) => {
    return jwt.sign({id ,name}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}
module.exports = {
    registerUser,
    loginUser,
    getMe,
}