const Member = require("../model/member.js");
const bcrypt = require("bcryptjs");
// const transporter = require("../db/emailConfig.js");
const Jwt = require("jsonwebtoken");
const { generateOTP, sendEmail } = require("../utils/emailUtils.js");
const {
  validateEmail,
} = require("../utils/allValidations.js");

const memberRegistration = async (req, res) => {
  const { name, email,mobile, password, confirm_password, country, city, chapter } = req.body;

  try {
    // Check if the email already exists
    const member = await Member.findOne({ email: email });
    if (member) {
      return res.send({ status: "failed", message: "Email already exists" });
    }

    // Check if all required fields are provided
    if (!name || !email || !mobile|| !password || !confirm_password || !country || !city || !chapter) {
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

    // Save the member to the database
    const doc = new Member({
      name,
      email,
      mobile,
      country,
      city,
      chapter,
      password: hashPassword,
    });
    await doc.save();
    
    // Respond with success message
    res.status(200).send({ status: "true", message: "Member Registered Successfully" , doc});
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "failed", message: "Unable to register" });
  }
};


// Login from
const memberLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    const member = await Member.findOne({ email: email });
    if (!member) {
      return res
        .status(404)
        .json({ status: "failed", message: "You are not a registered member" });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "failed", message: "Email or password is not valid" });
    }
  const userId= member._id;
    // Generate JWT Token
    const token = Jwt.sign({ userId:userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5d",
    });

    // Set cookie options
    const cookieOptions = {
      maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days in milliseconds
      httpOnly: true,
      sameSite: 'None',
      secure: process.env.NODE_ENV === 'development', // Use secure cookies in production
    };

    // Set the token in a cookie
    res.cookie("token", token, cookieOptions);

    res.json({
      status: "success",
      message: "Login success",
      token: token,
      userId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Unable to login" });
  }
};




//forgot password

const sendmemberPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Check if the member exists
    const member = await Member.findOne({ email });
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "member not found" });
    }
    console.log(member,"member")
    // Generate OTP
    const otp = generateOTP();

    // Save the OTP to the member's document (optional)
    member.resetOTP = otp;
    await member.save();

    // Send email with OTP
    const subject = "Password Reset OTP";
    const text = `Your OTP for password reset is: ${otp}`;
    await sendEmail(member.email, subject, text);
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

const memberPasswordReset = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    // Check if the member exists
    const member = await Member.findOne({ resetOTP: otp });
    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "member not found" });
    }

    // Verify OTP
    if (member.resetOTP !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    member.password = hashPassword;
    member.resetOTP = undefined; // Clear the OTP field
    await member.save();
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

const logoutmember = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', { 
      httpOnly: true,
      sameSite:"None",
      secure:true 

    });
    return res.status(200).json({ success: true, message: "member logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


const getmemberById = async (req, res) => {
  try {
    const memberId =  req.userId;
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "member not found" });
    }
    res.status(200).json({ data: member });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getAllmember = async (req, res) => {
  try {
    const { page = 1 } = req.query;
        const limit = 5;
        const count = await Member.countDocuments();
    const member = await Member.find()
    .skip((page - 1) * limit) // Skip records for previous pages
    .limit(limit);;
    if (!member) {
      return res.status(404).json({ message: "member not found" });
    }
    res.status(200).send({
      data: member,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit,
      message: "member fetched successfully",
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const updatememberById = async (req, res) => {
  try {
    const { id } = req.params;
    const memberData = req.body;
    const updatedmember = await Member.findByIdAndUpdate(id, memberData, { new: true });
    if (!updatedmember) {
      return res.status(404).json({ message: "member not found" });
    }
    res.status(200).json({ data: updatedmember });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deletememberById = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedmember = await Member.findByIdAndDelete(id);
    if (!deletedmember) {
      return res.status(404).json({ message: "member not found" });
    }
    res.status(200).json({ message: "member deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const Totalmember = async (req, res) => {
  try {
    const Totalmembers = await Member.find().countDocuments();
      console.log(Totalmembers);
      return res
      .status(200)
      .json({success:true , message:`total members are ${Totalmembers}`, Totalmembers })

  } catch (error) {
      console.log(error)
      return res
      .status(500)
      .json({success:false , message:"server error"})
  }
}

module.exports = {
  memberRegistration,
  memberLogin,
  sendmemberPasswordResetEmail,
  memberPasswordReset,
  logoutmember,
  getmemberById,
  updatememberById,
  deletememberById,
  getAllmember,
  Totalmember
};
