const getEmailTemplate = (name, email, mobile) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <style>
  body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f3f4f6;
    padding: 16px;
    margin: 0;
}

/* Container for centering content */
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

/* Main content styling */
.email-content {
    max-width: 600px;
    width: 100%;
    padding: 24px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

/* Header styling */
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #e53e3e;
    color: #ffffff;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 24px;
}

.header h1 {
    font-size: 30px;
    font-weight: bold;
}

/* Title styling */
.title {
    font-size: 24px;
    font-weight: bold;
    color: #2d3748;
    margin-bottom: 16px;
}

/* Paragraph styling */
.greeting, .message, .details, .contact, .closing, .signature {
    font-size: 16px;
    margin-bottom: 16px;
}

/* Details list styling */
.details-list {
    list-style-type: none;
    padding-left: 0;
    margin-bottom: 16px;
}

.details-list li {
    color: #4a5568;
}

/* Email link styling */
.email {
    color: #3182ce;
    text-decoration: none;
}

/* Signature styling */
.signature {
    font-weight: bold;
    color: #2d3748;
}

/* Social media icons styling */
.social-media {
    display: flex;
    justify-content: left;
    gap: 10px;
    margin: 20px 0;
}

.social-icon {
    color: #333;
    font-size: 24px;
    text-decoration: none;
}
  </style>
</head>
<body>
    <div class="container">
        <div class="email-content">
            <header class="header">
                <h1>B-CONN</h1>
            </header>
            <h1 class="title">Welcome to Our Company!</h1>
            <p class="greeting">Hi ${name},</p>
            <p class="message">Thank you for registering with us. Your account has been successfully created.</p>
            <p class="details">Here are your details:</p>
            <ul class="details-list">
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Mobile:</strong> ${mobile}</li>
            </ul>
            <p class="contact">We are excited to have you on board. If you have any questions, feel free to contact us at <a href="mailto:support@ourcompany.com" class="email">support@ourcompany.com</a>.</p>
           
            <p class="closing">Best Regards,</p>
            <p class="signature">Our Company</p>
             <div class="social-media">
                <a href="https://facebook.com" class="social-icon" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="https://instagram.com" class="social-icon" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="https://whatsapp.com" class="social-icon" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                <a href="https://twitter.com" class="social-icon" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            </div>
        </div>
    </div>
</body>
</html>
`;

module.exports = {
  getEmailTemplate,
};
