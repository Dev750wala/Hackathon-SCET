import { Request, Response } from "express";
import { connectToDB, disConnectfromDB } from "../utilities/connection";
import PROJECT from "../models/project-model";

export async function handleShowProject(req: Request, res: Response) {
    
    await connectToDB();
    const projectId: string = req.params.projectId;

    try {
        const project = await PROJECT.findOne({ id: projectId });

        if (!project) {
            return res.status(404).json({ message: "project not found" });
        }
        
        return res.status(200).json(project);

        // if (req.user && req.user?.username === user.username) {
        //     return res.status(200).json({ ...user, selfProfile: true })
        // } else {
        //     return res.status(200).json({ ...user, selfProfile: false });
        // }

    } catch (error) {
        console.log(`Unexpected error occured: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await disConnectfromDB();
    }
}