import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// SMTP credentials
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // or your host's SMTP server
    port: Number(process.env.EMAIL_PORT), 
    secure: process.env.EMAIL_SECURE === 'true', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use an app password if 2FA is enabled
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
    try {
        await transporter.sendMail({
            from: '"Amiran Driving College" <info@amirandrivingcollege.co.ke>',
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
        console.log('📧 Email sent to:', options.to);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};