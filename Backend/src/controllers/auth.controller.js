const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
/**
 * @name registerUserController
 * @description register a new user, experts username, email and password in the request body
 * @access Public
 */
async function registerUserController(req,  res) {

    const { username, email, password } = req.body;

   if(!username || !email || !password) {
    return res.status(400).json({ message: "Please provide username, email and password" });
   }

   const isUserAlreadyExist = await userModel.findOne({ $or: [{ username }, { email }] });

   if(isUserAlreadyExist) {

    /* isUserAlreadyExist will return the user object if it exists, so we can check if the username or email is already taken by checking the properties of the returned object */
    return res.status(400).json({ message: "Username or email already taken" });
   }

   const hash = await bcrypt.hash(password, 10);

   const user = await userModel.create({ username, email, password: hash });

   const token = jwt.sign(
    {id: user._id, username: user.username},
    process.env.JWT_SECRET,
    { expiresIn: "1d" }

   )
   res.cookie("token", token)
    res.status(201).json({ message: "User registered successfully", user: { id: user._id, username: user.username, email: user.email },});
}
/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */

async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token);

    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}
/**
 * @name logoutUserController
 * @descriptuion clear token from user cookie and add the token in blacklist
 * @access Public
 */

async function logoutUserController(req, res) {
    const token = req.cookies.token;  
    if(token) {
        await tokenBlacklistModel.create({ token });
    }
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
}

/**
 * 
 * @name getMeController
 * @description get the current logged in user detail
 * @access private 
 */


async function getMeController(req, res) {
     const user = await userModel.findById(req.user.id)

     res.status(200).json({
        message: "User details fetched successfully",
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
;