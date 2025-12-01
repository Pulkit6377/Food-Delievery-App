import dotenv from 'dotenv'

dotenv.config();

import nodemailer from "nodemailer";

const Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

Transporter.verify((error, success) => {
    if (error) {
        console.log("Transporter Error:", error);
    } else {
        console.log("Transporter is ready:", success);
    }
});

export default Transporter;
