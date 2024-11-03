import nodemailer from 'nodemailer';
import { IUser } from '../interfaces/user-interfaces';
import fs from "fs"
import path from "path"
import dotenv from "dotenv"
import { IProject } from '../interfaces/project-interfaces';

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

export async function sendMail(user: IUser, project: IProject | null, user2: IUser | null, subject: "verify" | "proposalForCollab") {

    let emailBody;
    try {
        if (subject === "verify") {
            const data = fs.readFileSync(path.join(__dirname, "../mail-formats/email-verification.txt"), "utf8").replace("[User]", `${user.fullName}`).replace("[VERIFICATION_LINK]", `${process.env.FRONTEND_URL}/user/verifyEmail/${user.username}/${user.verificationCode.code}`);
            emailBody = data;
        } else {

            const collabProposal = fs.readFileSync(path.join(__dirname, "../mail-formats/collab-proposal.txt"), "utf8")
            .replace("[Project Name]", `${project?.name}`)
            .replace("[Recipient Name]", `${user2?.fullName}`)
            .replace("[Recipient's Expertise]", `${user2?.skills?.join(", ")}`)
            .replace("[Project Link]", `${process.env.BASE_URL}/projects/${project?.id}`)
            .replace("[Your Name]", `${user?.fullName}`) 
            .replace("[Your Profile]", `${process.env.BASE_URL}/user/${user?.username}`) 
            .replace("[Reject Link]",  `${process.env.BASE_URL}/user/collab-proposal/${project?.id}/${user2?.username}/f3b42cb0cb114a408139735f762ab9b6r`) 
            .replace("[Approve Link]",  `${process.env.BASE_URL}/user/collab-proposal/${project?.id}/${user2?.username}/6d0373a2e96149859786420dc6873457a`) 

            emailBody = collabProposal;
        }

    } catch (error) {
        console.error("Error reading email template file", error);
        return;
    }
    let subject_;
    if (subject === "verify") {
        subject_ = "Email Verification"
    } else if (subject === "proposalForCollab") {
        subject_ = "Proposal For Collaboration"
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
        await transporter.sendMail(mailOptions);
    } catch (error: any) {
        console.log("There was an error sending an email", error);
        console.log("There was an error sending an email");
        return;
    }
}
