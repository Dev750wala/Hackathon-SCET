import mongoose from "mongoose";

export interface Judge {
    name: string;
}

export interface TechnologyTag {
    technology: string;
}

export interface TeamMember {
    _id: mongoose.Types.ObjectId;
}

export interface ParticipationTeam extends mongoose.Document {
    name: string;
    description: string;
    teamMembers: mongoose.Types.ObjectId[] | TeamMember[];
}

export interface IProject extends mongoose.Document {
    id: string;
    name: string;
    description: string;
    registrationStart: Date;
    registrationEnd: Date;
    start: Date;
    end?: Date;
    organizer: mongoose.Types.ObjectId;
    maxParticipants: number;
    judges: { name: string; userId?: mongoose.Types.ObjectId }[];
    prizes?: string;
    rulesAndRegulations: string;
    theme?: string;
    techTags: string[];
    participantTeam: {
        id: mongoose.Types.ObjectId;
        name: string;
        description: string;
        teamMembers: {
            id: mongoose.Types.ObjectId;
            name: string;
            participatingStatus: 'accepted' | 'pending';
        }[];
    }[];
    status: 'planned' | 'ongoing' | 'completed';
}

export interface ProjectCreationDetails {
    name: string;
    description: string;
    registrationStart: Date;
    registrationEnd: Date;
    start: Date;
    // end: Date;
    // organizer: mongoose.Types.ObjectId;
    maxParticipants: number;
    judges: { name: string; userId?: mongoose.Types.ObjectId }[];
    prizes?: string;
    rulesAndRegulations: string;
    theme?: string;
    techTags: string[];
    // status: 'planned' | 'ongoing' | 'completed';
}