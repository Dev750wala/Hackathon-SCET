import { query, Request, Response } from "express";
import { connectToDB, disConnectfromDB } from "../utilities/connection";
import USER from "../models/user-model";
import { Filters } from "../interfaces/project-interfaces";
import { PipelineStage } from "mongoose";
import PROJECT from "../models/project-model";
// import { ParsedQs } from "qs";


export async function handleGetUserData(req: Request, res: Response) {
    // console.log("handleGetUserData");
    const filters: Filters = req.query as unknown as Filters;
    const inputText = req.query.inputText as string;

    const userAggregationPipeline: PipelineStage[] = [];
    const projectAggregationPipeline: PipelineStage[] = [];
    const regexOfSearch = new RegExp(inputText, 'i');


    // -----------------------------------------------------------
    projectAggregationPipeline.push({
        $match: {
            $or: [
                { name: { $regex: regexOfSearch } },
                { description: { $regex: regexOfSearch } }
            ]
        }
    })
    if (filters.dateRange) {
        if (filters.dateRange.startDate) {
            projectAggregationPipeline.push({
                $match: {
                    start: { $gte: filters.dateRange.startDate }
                }
            })
        }
        if (filters.dateRange.endDate) {
            projectAggregationPipeline.push({
                $match: {
                    end: { $lte: filters.dateRange.endDate }
                }
            })
        }
    }
    if (filters.status !== "") {
        projectAggregationPipeline.push({
            $match: {
                status: filters.status
            }
        })
    }
    if (typeof filters.maxParticipants !== "string") {
        projectAggregationPipeline.push({
            $match: {
                maxParticipants: { $lte: filters.maxParticipants }
            }
        })
    }
    // -----------------------------------------------------------


    userAggregationPipeline.push({
        $match: {
            $or: [
                { username: { $regex: regexOfSearch } },
                { fullName: { $regex: regexOfSearch } }
            ]
        }
    });

    if (filters.role.length > 0) {
        userAggregationPipeline.push({
            $match: {
                role: filters.role,
            }
        });
    };

    if (filters.available === true) {
        userAggregationPipeline.push({
            $match: {
                available: filters.available,
            }
        });
    }
    // -----------------------------------------------------------

    try {
        const users = await USER.aggregate([
            ...userAggregationPipeline,
            {
                $project: {
                    _id: 0,
                    availability: 1,
                    username: 1,
                    fullName: 1,
                    skills: 1,
                    biography: 1,
                    portfolio: 1,
                    socialLinks: 1,
                    role: 1,
                }
            }
        ]).exec();
        const projects = await PROJECT.aggregate([
            ...projectAggregationPipeline,
            {
                $project: {
                    _id: 0,
                    id: 1,
                    name: 1,
                    status: 1,
                    start: 1,
                    end: 1,
                    maxParticipants: 1,
                    techTags: 1,
                    organizer: 1,
                    description: 1,
                }
            }
        ]).exec();
        console.log("--------------------------------------------------");
        console.log(users);
        console.log("--------------------------------------------------");
        console.log(projects);
        console.log("--------------------------------------------------");
        
        

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

    // if (filters.username && inputText) {
    //     query.username = { $regex: inputText, $options: 'i' };
    // }
    // if (filters.fullName && inputText) {
    //     query.fullName = { $regex: inputText, $options: 'i' };
    // }
    // if (filters.role) {
    //     query.role = filters.role;
    // }
    // if (filters.available !== undefined) {
    //     query.available = filters.available;
    // }
    // if (filters.projectName && inputText) {
    //     query.projectName = { $regex: inputText, $options: 'i' };
    // }
    // if (filters.dateRange) {
    //     query.date = {
    //         $gte: filters.dateRange.startDate,
    //         $lte: filters.dateRange.endDate,
    //     };
    // }
    // if (filters.organizer) {
    //     query.organizer = filters.organizer;
    // }
    // if (filters.status) {
    //     query.status = filters.status;
    // }
    // if (typeof filters.maxParticipants === "number" && filters.maxParticipants > 0) {
    //     query.maxParticipants = { $lte: filters.maxParticipants };
    // }

}