import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const Transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
    secure: false,          // Brevo uses STARTTLS over port 587
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
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
