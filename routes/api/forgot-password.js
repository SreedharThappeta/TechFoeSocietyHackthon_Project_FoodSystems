const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const resetPasswordToken = require('../model/resetPassword'); // adjust the path
const router = express.Router();

router.post('/', async (req, res) => {
    const token = crypto.randomBytes(20).toString('hex');
    const email = req.body.email;

    // Store token in DB
    await resetPasswordToken.create({ email, token });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        }
    });

    try {
        await transporter.sendMail({
            from: {
                name: 'Food For All',
                address: process.env.USER
            },
            to: email,
            subject: 'Reset Password Request',
            text: `Link: http://3.110.45.191:3500/resetpassword?token=${token}&email=${email}`
        });

        console.log('Email sent successfully to:', email);
        res.json({ message: "Email sent successfully" });
    } catch (err) {
        console.error('Error sending email:', err);
        res.status(500).json({ message: 'Error sending email' });
    }
});

module.exports = router;
