import { Request, Response } from "express";
import { connectToDB, disConnectfromDB } from "../utilities/connection";
import USER from "../models/user-model";

export async function handleGetUserData(req: Request, res: Response) {
    console.log("handleGetUserData");

    await connectToDB();
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).send('Username not provided');
        }

        const users = await USER.find({ username: { $regex: username, $options: 'i' } }).select("username fullName");

        if (users.length === 0) {
            return res.status(404).send('No user found');
        }
        return res.status(200).json(users);

    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    } finally {
        disConnectfromDB();
    }
}