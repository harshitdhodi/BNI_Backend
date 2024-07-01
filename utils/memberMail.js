const nodemailer = require('nodemailer');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'harshit.dhodi2108@gmail.com',
    pass: "pyvokrpvpyygpdps",
  },
});



// Send email
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: 'harshit.dhodi2108@gmail.com',
      to,
      subject,
      text,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {

  sendEmail,
};
