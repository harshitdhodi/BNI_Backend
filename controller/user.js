const user = require("../model/user.js");
const bcrypt = require("bcryptjs");
// const transporter = require("../db/emailConfig.js");
const Jwt = require("jsonwebtoken");
const { generateOTP, sendEmail } = require("../utils/emailUtils.js");
const {
  validateEmail,
  validateMobile,
  validateStrongPassword,
} = require("../utils/allValidations.js");

const userRegistration = async (req, res) => {
  const { firstName, lastName, email, password, confirm_password } = req.body;
  const photo = req.files.map((file) => file.filename)
  try {
    // Check if the email already exists
    const User = await user.findOne({ email: email });
    if (User) {
      return res.send({ status: "failed", message: "Email already exists" });
    }
  
    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !photo || !password || !confirm_password) {
      console.log("Validation failed.......");
      return res.send({ status: "failed", message: "All fields are required" });
    }

    // Check if password and confirm_password match
    if (password !== confirm_password) {
      return res.send({
        status: "failed",
        message: "Password and confirm password do not match",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Save the user to the database
    const doc = new user({
      firstName: firstName,
      lastName: lastName,
      email: email,
      photo:photo,
      password: hashPassword,
    });
    await doc.save();
    
    // Redirect to the login page
    res.status(200).send({ status: "true", message: "user Register Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "failed", message: "Unable to register" });
  }
};


// Login from
const userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }
  
      const User = await user.findOne({ email: email });
    //   console.log(User)
      if (!User) {
        return res
          .status(404)
          .json({ status: "failed", message: "You are not a registered user" });
      }
    console.log(User)
      const isMatch = await bcrypt.compare(password, User.password); // Corrected line
      if (!isMatch) {
        return res
          .status(401)
          .json({ status: "failed", message: "Email or password is not valid" });
      }
   
      // Generate JWT Token
      const token = Jwt.sign({ userId: User._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "5d",
      });
      console.log(token)
      // const cookieOptions = {
      //   maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days in milliseconds
      //   httpOnly: true,
      //   sameSite: 'None',
      //   secure: process.env.NODE_ENV === 'development', // Use secure cookies in production
      // };

      // res.cookie("token", token, cookieOptions);
      // res.redirect("/home");
      res.json({
        status: "success",
        message: "Login success",
        token: token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "failed", message: "Unable to login" });
    }
  };
//

//forgot password

const sendUserPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Check if the user exists
    const User = await user.findOne({ email });
    if (!User) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    console.log(User,"user")
    // Generate OTP
    const otp = generateOTP();

    // Save the OTP to the user's document (optional)
    User.resetOTP = otp;
    await User.save();

    // Send email with OTP
    const subject = "Password Reset OTP";
    const text = `Your OTP for password reset is: ${otp}`;
    await sendEmail(User.email, subject, text);
    // res.redirect("/reset_password");
    // Return success response
    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const userPasswordReset = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    // Check if the user exists
    const User = await user.findOne({ resetOTP: otp });
    if (!User) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify OTP
    if (User.resetOTP !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    // // Validate new password format
    // if (!validateStrongPassword(newPassword)) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: 'Invalid password format' });
    // }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    User.password = hashPassword;
    User.resetOTP = undefined; // Clear the OTP field
    await User.save();
    // res.redirect("/login");
    // Return success response
    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', { 
      httpOnly: true,
      sameSite:"None",
      secure:true 

    });
    return res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


const getUserById = async (req, res) => {
  try {
    const userId =  req.userId;
    const User = await user.findById(userId);
    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: User });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserById = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = req.body;
    console.log(userId)
    console.log(userData)
    const updatedUser = await user.findByIdAndUpdate(userId, userData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await user.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  userRegistration,
  userLogin,
  sendUserPasswordResetEmail,
  userPasswordReset,
  logoutUser,
  getUserById,
  updateUserById,
  deleteUserById
};
