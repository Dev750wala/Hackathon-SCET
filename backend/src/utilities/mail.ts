import nodemailer from 'nodemailer';
import { IUser } from '../interfaces/user-interfaces';
import fs from "fs"
import path from "path"



export function sendMail(user: IUser) {

    let emailBody;
    try {
        const data = fs.readFileSync(path.join(__dirname, "emailVerificationMailFormat.txt"), "utf8").replace("[User]", `${user.fullName}`).replace("[VERIFICATION_LINK]", `${process.env.BASE_URL}/users/verifyEmail/${user.username}/${user.verificationCode.code}`);

        emailBody = data;
    } catch (error) {
        console.error("Error reading email template file", error);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSKEY,
        }
    })

    const mailOptions: nodemailer.SendMailOptions = {
        from: {
            name: "Dev Sadisatsowala",
            address: process.env.NODEMAILER_EMAIL as string
        },
        to: user.email,
        subject: 'Email verification',
        html: emailBody,
    };

    try {
        transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("There was an error sending email");
        return;
    }
}
