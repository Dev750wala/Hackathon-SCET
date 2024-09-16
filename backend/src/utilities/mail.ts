import nodemailer from 'nodemailer';
import { IUser } from '../interfaces/user-interfaces';
import fs from "fs"
import path from "path"

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSKEY,
    }
});

export function sendMail(user: IUser, subject: "verify" | "proposalForCollab") {

    let emailBody;
    try {
        const data = fs.readFileSync(path.join(__dirname, "../mail-formats/email-verification.txt"), "utf8").replace("[User]", `${user.fullName}`).replace("[VERIFICATION_LINK]", `${process.env.BASE_URL}/user/verifyEmail/${user.username}/${user.verificationCode.code}`);

        emailBody = data;
    } catch (error) {
        console.error("Error reading email template file", error);
        return;
    }
    let subject_;
    if (subject === "verify") {
        subject_ = "Email Verification"
    } else if (subject === "proposalForCollab") {
        subject_ = "Proposal For Contribution"
    }
    

    const mailOptions: nodemailer.SendMailOptions = {
        from: {
            name: "Dev Sadisatsowala",
            address: process.env.NODEMAILER_EMAIL as string
        },
        to: user.email,
        subject: subject_,
        html: emailBody,
    };

    try {
        transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("There was an error sending an email");
        return;
    }
}
