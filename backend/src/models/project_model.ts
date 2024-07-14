import mongoose from "mongoose";
import { IProject } from "../interfaces/project-interfaces";



const projectSchema = new mongoose.Schema<IProject>({
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        start: {
            type: Date,
            required: true,
        },
        end: {
            type: Date,
            required: true,
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        maxParticipants: {
            type: Number,
            required: true,
        },
        judges: [
            {
                name: {
                    type: String,
                    required: true,
                },
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'user',
                },
            },
        ],
        prizes: {
            type: String,
        },
        rulesAndRegulations: {
            type: String,
            required: true,
        },
        theme: {
            type: String,
        },
        techTags: [
            {
                name: {
                    type: String,
                },
            },
        ],
        participantTeam: {
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            teamMembers: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'user',
                },
            ],
        },
        status: {
            type: String,
            enum: ['planned', 'ongoing', 'completed'],
            default: 'planned',
        },
    }, { timestamps: true },
)

const PROJECT = mongoose.model("project", projectSchema);

export default PROJECT;