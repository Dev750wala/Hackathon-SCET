import { Request, Response } from "express";
import { connectToDB, disConnectfromDB } from "../utilities/connection";
import PROJECT from "../models/project-model";
import USER from "../models/user-model";
import { IProject, ParticipationTeam } from "../interfaces/project-interfaces";
// import mongoose from "mongoose";

export async function handleShowProject(req: Request, res: Response) {
    try { 
        await connectToDB();
        const projectId: string = req.params.projectId;
        if (!projectId) {
            return res.status(400).json({ message: "Project ID not provided" });
        }

        let project = await PROJECT.findOne({ id: projectId }, { _id: 0, __v: 0 }).lean() as IProject;
        console.log("The project is below: ")
        console.log(project);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        
        console.log("before");
        const organizerData = await USER.findById(project.organizer, { _id: 0, username: 1, fullName: 1 });
        console.log("after");
        
        if (!organizerData) {
            return res.status(404).json({ message: "Organizer not found" });
        }

        const transformedJudges = await Promise.all(
            project.judges.map(async (judge) => {
                if (judge.userId) {
                    const user = await USER.findById(judge.userId, { username: 1 });
                    return {
                        name: judge.name,
                        userDetails: user ? { username: user.username } : null,
                    };
                } else {
                    return {
                        name: judge.name,
                        userDetails: null,
                    };
                }
            })
        );

        const projectResponse = {
            id: project.id,
            name: project.name,
            description: project.description,
            registrationStart: project.registrationStart,
            registrationEnd: project.registrationEnd,
            start: project.start,
            end: project.end,
            organizer: {
                username: organizerData.username,
                fullName: organizerData.fullName,
            },
            maxParticipants: project.maxParticipants,
            judges: transformedJudges,
            prizes: project.prizes || '',
            rulesAndRegulations: project.rulesAndRegulations,
            theme: project.theme || '',
            techTags: project.techTags,
            totalTeams: project.participantTeam.length,
            status: project.status,
        };

        let flag = false;
        let selfTeamStatus: Partial<ParticipationTeam> = {};
        if (req.user !== null || req.user !== undefined) {
            for (let i = 0; i < project.participantTeam.length; i++) {
                for (let j = 0; j < project.participantTeam[i].teamMembers.length; j++) {
                    if (project.participantTeam[i].teamMembers[j].id === req.user?._id) {
                        selfTeamStatus = project.participantTeam[i];
                        flag = true;
                    }   
                }
            }

            if (!flag) {
                return res.status(200).json({ project: projectResponse, selfTeamData: null });
            }

            // interface finalSelfTeamDataInterface {
            //     name: string;
            //     description?: string;
            //     teamMembers: {
            //         username?: string;
            //         fullName?: string;
            //         participatingStatus: string;
            //     }
            // }
            let finalSelfTeamData: {
                    name: string;
                    description?: string;
                    teamMembers: {
                        username?: string;
                        fullName?: string;
                        participatingStatus: string;
                    }[];
                } = {
                name: selfTeamStatus.name as string,
                description: selfTeamStatus.description as string,
                teamMembers: []
            };
            if (Object.keys(selfTeamStatus).length !== 0) {
                selfTeamStatus.teamMembers?.map(async (member) => {
                    const user = await USER.findById(member.id, { _id: 0, fullName: 1, username: 1 });
                    finalSelfTeamData.teamMembers.push({
                        username: user?.username,
                        fullName: user?.fullName,
                        participatingStatus: member.participatingStatus,
                    })
                })
            }
        }

        return res.status(200).json({ project: projectResponse, selfTeamData: null });

    } catch (error) {
        console.log(`Unexpected error occurred: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    } 
    // finally {
    //     await disConnectfromDB();
    // }
}
