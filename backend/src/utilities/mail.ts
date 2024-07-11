import nodemailer from 'nodemailer';
import { IUser } from '../interfaces/user-interfaces';

export function sendMail(user: IUser) {

    nodemailer.createTestAccount((err, account) => {
        if (err) {
            console.error('Failed to create a testing account. ' + err.message);
            return false;
        }
        console.log('Credentials obtained, sending message...');

        let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        const mailOptions: nodemailer.SendMailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: user.email,
            subject: 'Email verification',
            text: `Hi, ${user.fullName}, Your username is ${user.username}.
            

            Please verify your email by clicking the following link: ${process.env.BASE_URL}/user/verify-email/${user.verificationCode.code}`
        };
        
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                return false
            }
            
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            return true;
        });
    });
}
