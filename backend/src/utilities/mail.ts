import nodemailer from 'nodemailer';
import { IUser } from '../models/user_model';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    }
});

export function sendMail(user: IUser) {

    const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.NODEMAILER_EMAIL,
        to: user.email,
        subject: 'Email verification',
        text: `Hi, ${user.fullName}, Your username is ${user.username}. 
        Please verify your email by clicking the following link: ${process.env.BASE_URL}/user/verify-email/${user.verificationCode}`,
    };

    transporter.sendMail(mailOptions, function (err: any, info: nodemailer.SentMessageInfo) {
        if (err) {
            console.log(err);
            // return false if email sending failed
            return false;
        }
        console.log('Message sent successfully');
        // return true if email was sent successfully
        return true;
    });
}
