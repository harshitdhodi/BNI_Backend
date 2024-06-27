const Customer = require("../model/customer.js");
const bcrypt = require("bcrypt");
// const transporter = require("../db/emailConfig.js");
const Jwt = require("jsonwebtoken");
const { generateOTP, sendEmail } = require("../utils/emailUtils.js");
const {
  validateEmail,
} = require("../utils/allValidations.js");

const customerRegistration = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  try {
    // Check if the email already exists
    const customer = await Customer.findOne({ email: email });
    if (customer) {
      return res.send({ status: "failed", message: "Email already exists" });
    }

    // Check if all required fields are provided
    if (!name || !email || !password || !confirm_password) {
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

    // Save the customer to the database
    const doc = new Customer({
      name: name,
      email: email,
      password: hashPassword,
    });
    await doc.save();
    
    // Redirect to the login page
    res.status(200).send({ status: "true", message: "customer Register Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "failed", message: "Unable to register" });
  }
};


// Login from
const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }

    const customer = await Customer.findOne({ email: email });
    if (!customer) {
      return res
        .status(404)
        .json({ status: "failed", message: "You are not a registered customer" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "failed", message: "Email or password is not valid" });
    }
  const userId= customer._id;
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Unable to login" });
  }
};




//forgot password

const sendcustomerPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Check if the customer exists
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "customer not found" });
    }
    console.log(customer,"customer")
    // Generate OTP
    const otp = generateOTP();

    // Save the OTP to the customer's document (optional)
    customer.resetOTP = otp;
    await customer.save();

    // Send email with OTP
    const subject = "Password Reset OTP";
    const text = `Your OTP for password reset is: ${otp}`;
    await sendEmail(customer.email, subject, text);
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

const customerPasswordReset = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    // Check if the customer exists
    const customer = await Customer.findOne({ resetOTP: otp });
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "customer not found" });
    }

    // Verify OTP
    if (customer.resetOTP !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    customer.password = hashPassword;
    customer.resetOTP = undefined; // Clear the OTP field
    await customer.save();
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

const logoutcustomer = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', { 
      httpOnly: true,
      sameSite:"None",
      secure:true 

    });
    return res.status(200).json({ success: true, message: "customer logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


const getcustomerById = async (req, res) => {
  try {
    const customerId =  req.customerId;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "customer not found" });
    }
    res.status(200).json({ data: customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getAllCustomer = async (req, res) => {
  try {
    const { page = 1 } = req.query;
        const limit = 5;
        const count = await Customer.countDocuments();
    const customer = await Customer.find()
    .skip((page - 1) * limit) // Skip records for previous pages
    .limit(limit);;
    if (!customer) {
      return res.status(404).json({ message: "customer not found" });
    }
    res.status(200).send({
      data: customer,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit,
      message: "customer fetched successfully",
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const updatecustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customerData = req.body;
    const updatedcustomer = await Customer.findByIdAndUpdate(id, customerData, { new: true });
    if (!updatedcustomer) {
      return res.status(404).json({ message: "customer not found" });
    }
    res.status(200).json({ data: updatedcustomer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deletecustomerById = async (req, res) => {
  try {
    const { id } = req.query;
    const deletedcustomer = await Customer.findByIdAndDelete(id);
    if (!deletedcustomer) {
      return res.status(404).json({ message: "customer not found" });
    }
    res.status(200).json({ message: "customer deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const TotalCustomer = async (req, res) => {
  try {
    const TotalCustomers = await Customer.find().countDocuments();
      console.log(TotalCustomers);
      return res
      .status(200)
      .json({success:true , message:`total Customers are ${TotalCustomers}`, TotalCustomers })

  } catch (error) {
      console.log(error)
      return res
      .status(500)
      .json({success:false , message:"server error"})
  }
}

module.exports = {
  customerRegistration,
  customerLogin,
  sendcustomerPasswordResetEmail,
  customerPasswordReset,
  logoutcustomer,
  getcustomerById,
  updatecustomerById,
  deletecustomerById,
  getAllCustomer,
  TotalCustomer
};
