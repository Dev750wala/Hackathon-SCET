import nodemailer from 'nodemailer';
import { IUser } from '../interfaces/user-interfaces';
import fs from "fs"
import path from "path"
import dotenv from "dotenv"

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSKEY,
    },
    authMethod: 'PLAIN',
});

export async function sendMail(user: IUser, subject: "verify" | "proposalForCollab") {

    let emailBody;
    try {
        const data = fs.readFileSync(path.join(__dirname, "../mail-formats/email-verification.txt"), "utf8").replace("[User]", `${user.fullName}`).replace("[VERIFICATION_LINK]", `${process.env.FRONTEND_URL}/user/verifyEmail/${user.username}/${user.verificationCode.code}`);

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

    // console.log("%c mailOptions", "color: red; font-size: 16px; font-weight: bold", mailOptions);
    

    try {
        await transporter.sendMail(mailOptions);
    } catch (error: any) {
        console.log("There was an error sending an email", error);
        console.log("There was an error sending an email");
        return;
    }
}
