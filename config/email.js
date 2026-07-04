import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ path: "./.env" });

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send verification email
export const sendVerificationEmail = async (user, verificationLink) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Verify your Email",
            html: `
                <h2>Welcome ${user.userName}!</h2>
                <p>Please click the button below to verify your email.</p>
                <a href="${verificationLink}">Verify Email</a>
            `
        });
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
    }
};