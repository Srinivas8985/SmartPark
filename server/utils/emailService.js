const nodemailer = require('nodemailer');

// Mock Transport (logs to console for simplicity in this demo environment)
// For real emails, configure STMP via env vars
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ethereal.user@ethereal.email', // Replace with real env vars
        pass: 'ethereal.pass'
    }
});

exports.sendBookingConfirmation = async (email, details) => {
    console.log(`[EMAIL SERVICE] Sending Confirmation to ${email}`, details);
    // In production: await transporter.sendMail(...)
    return true;
};

exports.sendCancellation = async (email, details) => {
    console.log(`[EMAIL SERVICE] Sending Cancellation to ${email}`, details);
    return true;
};
