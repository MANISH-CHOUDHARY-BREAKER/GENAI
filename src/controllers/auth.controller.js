const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
}

module.exports = { registerUserController}