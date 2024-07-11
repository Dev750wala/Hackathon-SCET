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

interface IProject extends mongoose.Document {
    id: string;
    name: string;
    description: string;
    start: Date;
    end: Date;
    organizer: mongoose.Types.ObjectId;
    maxParticipants: number;
    judges: { name: string; userId?: mongoose.Types.ObjectId }[];
    prizes?: string;
    rulesAndRegulations: string;
    theme?: string;
    techTags: { name: string }[];
    participantTeam: {
        name: string;
        description: string;
        teamMembers: mongoose.Types.ObjectId[];
    };
    status: 'planned' | 'ongoing' | 'completed';
}


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