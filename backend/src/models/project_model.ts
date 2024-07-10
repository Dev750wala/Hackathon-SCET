import mongoose from "mongoose";

interface Judge {
    name: string;
}

interface TechnologyTag {
    technology: string;
}

interface TeamMember {
    _id: mongoose.Types.ObjectId;
}

interface ParticipationTeam extends mongoose.Document {
    name: string;
    description: string;
    teamMembers: mongoose.Types.ObjectId[] | TeamMember[];
}

export interface HackathonInterface extends mongoose.Document {
    id: string;
    name: string;
    description: string;
    start: Date;
    end: Date;
    organizer: mongoose.Types.ObjectId;
    maxParticipants: number;
    judges: Judge[];
    prizes?: string;
    rulesAndRegulations: string;
    theme?: string;
    techTags: TechnologyTag[];
    participantTeam? : ParticipationTeam[];
}

const projectSchema = new mongoose.Schema({
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
            ref: 'user'
        },
        maxParticipants: {
            type: Number,
        },
        judges: [
            {
                name: {
                    type: String,
                },
            }
            // type: mongoose.Schema.Types.ObjectId,
            // ref: 'user',
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
                }
            }
        ],
        participantTeam: {
            name: String,
            description: String,
            teamMembers: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
            }]
        }
    }, { timestamps: true },
)

const PROJECT = mongoose.model("project", projectSchema);

export default PROJECT;