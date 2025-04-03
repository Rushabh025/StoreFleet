// Import the necessary modules here
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  service: process.env.SMPT_SERVICE,
  auth: {
    user: process.env.STOREFLEET_SMTP_MAIL,
    pass: process.env.STOREFLEET_SMTP_MAIL_PASSWORD,
  },
});


export const sendWelcomeEmail = async (user) => {
  const logoPath = path.resolve("public/images/logo.png");

  // Write your code here
  const mailOptions = {
    from: process.env.STOREFLEET_SMTP_MAIL,
    to: user.email,
    subject: 'Welcome to Our Company!',
    html: `
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <img src="cid:companylogo" style="width: 150px; height: auto;" alt="Company Logo">
        <h2>Welcome to Our Community!</h2>
        <p>We're excited to have you onboard.</p>
      </div>
    `,
    attachments: [
      {
        filename: 'logo.png',   // Your company logo
        path: logoPath, // Local path
        cid: 'companylogo' // Content ID to reference in the email body
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
