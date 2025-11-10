const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, patient, doctor, date, time) => {
  try {
    console.log('sendEmail called with:', { to, patient, doctor, date, time });
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      console.error("❌ Error sending email: No valid recipient email provided:", to);
      return;
    }
    // Create transporter
    let transporter = nodemailer.createTransport({
      service: "gmail", // for Gmail
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    let mailOptions = {
      from: `"Prescripto" <${process.env.EMAIL_USER}>`,
      to: to, // patient email
      subject: "Appointment Confirmation",
      text: `Hello ${patient}, your appointment with Dr. ${doctor} is confirmed on ${date} at ${time}.`,
      html: `<p>Hello <b>${patient}</b>,</p>
             <p>Your appointment with <b>Dr. ${doctor}</b> is confirmed on <b>${date}</b> at <b>${time}</b>.</p>
             <p>Thank you,<br>Prescripto</p>`,
    };

    // Send email
    let info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

module.exports = { sendEmail };
