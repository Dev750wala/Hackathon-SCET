'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CalendarDays, Users, PenTool, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import LiveAnimation from "./LiveAnimation"
import { debounce } from 'lodash';

interface TeamMember {
    name: string;
    participatingStatus: 'accepted' | 'pending';
}

interface Team {
    name: string;
    description: string;
    teamMembers: TeamMember[];
}

interface ProjectFetchingSuccessResponse {
    id: string;
    name: string;
    description: string;
    registrationStart: Date;
    registrationEnd: Date;
    start: Date;
    end?: Date;
    organizer: {
        username: string;
        fullName: string;
    };
    maxParticipants: number;
    judges: {
        name: string;
        userDetails: {
            fullName: string;
            username: string;
        } | null;
    }[];
    prizes: string;
    rulesAndRegulations: string;
    theme: string;
    techTags: string[];
    totalTeams: number;
    status: 'planned' | 'ongoing' | 'completed';
}

const demoProject: ProjectFetchingSuccessResponse = {
    id: "hack-2023-01",
    name: "TechInnovate Hackathon 2023",
    description: "Join us for a 48-hour coding marathon to solve real-world problems using cutting-edge technologies!",
    registrationStart: new Date("2023-08-01T00:00:00Z"),
    registrationEnd: new Date("2023-08-31T23:59:59Z"),
    start: new Date("2023-09-15T09:00:00Z"),
    organizer: {
        username: "dev.rathod",
        fullName: "Tappu Nago"
    },
    maxParticipants: 200,
    judges: [
        {
            name: "Alice Johnson",
            userDetails: {
                fullName: "Dr. Alice Johnson",
                username: "alice_j"
            }
        },
        {
            name: "Bob Smith",
            userDetails: {
                fullName: "Prof. Robert Smith",
                username: "bob_smith"
            }
        },
        {
            name: "Carol Zhang",
            userDetails: null
        }
    ],
    prizes: "1st Place: $5000, 2nd Place: $3000, 3rd Place: $1000, Best Rookie Team: $1000",
    rulesAndRegulations: "1. Teams must consist of 2-4 members.\n2. All code must be written during the hackathon.\n3. Use of open source libraries is allowed.\n4. Projects must be submitted by the deadline.\n5. Respect all participants and staff.",
    theme: "Sustainable Smart Cities",
    techTags: ["AI/ML", "IoT", "Blockchain", "Cloud Computing", "Mobile App"],
    totalTeams: 45,
    status: "planned"
}

export default function ProjectDetail({ isLoggedIn = true }: { isLoggedIn?: boolean }) {
    const project = demoProject
    const [expandedSection, setExpandedSection] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { register, control, handleSubmit, formState: { errors } } = useForm<Team>({
        defaultValues: {
            name: '',
            description: '',
            teamMembers: []
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'teamMembers'
    })

    const onSubmit = async (data: Team) => {
        setLoading(true)
        setError(null)
        try {
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log('Form submitted:', data)
            // Reset form or navigate to success page
        } catch (err) {
            setError('An error occurred while submitting the form.')
        } finally {
            setLoading(false)
        }
    }

    const searchUser = async (username: string): Promise<any> => {
        try {
            const response = await fetch(`/api/users/search?username=${username}`);
            return response.json();
        } catch (error) {
            console.error("Error searching user:", error);
            return null;
        }
    };


    const addTeamMember = () => {
        append({ name: '', participatingStatus: 'pending' })
    }

    const formatDate = (date: Date | undefined) => {
        return date ? new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) : 'N/A'
    }

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section)
    }

    if (!project) {
        return <div className="container mx-auto p-4">Loading project details...</div>
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <Card className="overflow-hidden">
                <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="text-3xl font-bold">{project.name}</CardTitle>
                    <p className="text-primary-foreground/80">{project.description}</p>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 ml-1">
                                <CalendarDays className="text-muted-foreground" />
                                <span><span className="font-bold">Registration:</span> {formatDate(project.registrationStart)} - {formatDate(project.registrationEnd)}</span>
                            </div>
                            {project.start < new Date() && (!project.end || project.end > new Date()) ? (
                                <div className="flex items-center justify-start space-x-2">
                                    <span className="rounded-full w-fit overflow-hidden flex flex-row justify-center items-center">
                                        <LiveAnimation />
                                    </span>
                                    <span className="text-red-600 font-bold px-0">Project is live!</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 mr-1">
                                    <CalendarDays className="text-muted-foreground" />
                                    <span>
                                        <span className="font-bold">Event:</span> {formatDate(project.start)}
                                        {project.end && (
                                            <span> - {formatDate(project.end)}</span>
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 mr-1">
                                <Users className="text-muted-foreground" />
                                <span><span className="font-bold">Max Participants:</span> {project.maxParticipants}</span>
                            </div>
                            <div className="flex items-center space-x-2 mr-1">
                                <Users className="text-muted-foreground" />
                                <span><span className="font-bold">Total Teams:</span> {project.totalTeams}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Organizer</CardTitle>
                </CardHeader>
                <CardContent>
                    <TooltipProvider>
                        <Tooltip>
                            <div className="flex items-center space-x-2 cursor-pointer">
                                <TooltipTrigger asChild>
                                    <Link to={`/${project.organizer.username}`}>
                                        <div className="flex flex-row items-center gap-2">
                                            <Avatar>
                                                <AvatarFallback>{project.organizer.username[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{project.organizer.username}</span>
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                            </div>
                            <TooltipContent side="top">
                                <p>{project.organizer.fullName}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Judges</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {project.judges.map((judge, index) => (
                            <TooltipProvider key={index}>
                                <Tooltip>
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                        <TooltipTrigger asChild>
                                            <div className="flex flex-row justify-center items-center gap-2">
                                                <Avatar>
                                                    <AvatarFallback>{judge.name[0].toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{judge.name}</span>
                                            </div>
                                        </TooltipTrigger>
                                    </div>
                                    <TooltipContent side="right">
                                        <p>{judge.userDetails?.fullName || 'N/A'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader
                    className="cursor-pointer transition-colors duration-200 hover:bg-muted/50 rounded-t-lg p-4"
                    onClick={() => toggleSection('prizes')}
                >
                    <CardTitle className="flex items-center justify-between">
                        <span>Prizes</span>
                        {expandedSection === 'prizes' ? (
                            <ChevronUp className="text-muted-foreground transition-transform transform rotate-180" />
                        ) : (
                            <ChevronDown className="text-muted-foreground transition-transform" />
                        )}
                    </CardTitle>
                </CardHeader>
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'prizes' ? 'max-h-96 opacity-100 visible py-4' : 'max-h-0 opacity-0 invisible'}`}
                >
                    <CardContent>
                        <p>{project.prizes}</p>
                    </CardContent>
                </div>
            </Card>

            <Card>
                <CardHeader
                    className="cursor-pointer transition-colors duration-200 hover:bg-muted/50 rounded-t-lg p-4"
                    onClick={() => toggleSection('rules')}
                >
                    <CardTitle className="flex items-center justify-between">
                        <span>Rules and Regulations</span>
                        {expandedSection === 'rules' ? (
                            <ChevronUp className="text-muted-foreground transition-transform transform rotate-180" />
                        ) : (
                            <ChevronDown className="text-muted-foreground transition-transform" />
                        )}
                    </CardTitle>
                </CardHeader>
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'rules' ? 'max-h-96 opacity-100 visible py-4' : 'max-h-0 opacity-0 invisible'}`}
                >
                    <CardContent>
                        <p className="whitespace-pre-line">{project.rulesAndRegulations}</p>
                    </CardContent>
                </div>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Theme and Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <PenTool className="text-muted-foreground" />
                            <span className="font-medium">Theme: {project.theme}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {project.techTags.map((tag, index) => (
                                <Badge key={index} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="mt-4">
                    <Badge
                        variant={project.status === 'planned' ? 'outline' : project.status === 'ongoing' ? 'default' : 'secondary'}
                        className="text-lg py-1 px-3"
                    >
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Badge>
                </CardContent>
            </Card>

            {isLoggedIn && (
                <Card>
                    <CardHeader>
                        <CardTitle>Participate in the Hackathon</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Team Name</Label>
                                <Input
                                    id="name"
                                    {...register('name', { required: 'Team name is required' })}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>
                            <div>
                                <Label htmlFor="description">Team Description</Label>
                                <Textarea
                                    id="description"
                                    {...register('description', { required: 'Team description is required' })}
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                            </div>
                            <div>
                                <Label>Team Members</Label>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex items-center space-x-2 mt-2">
                                        <Input
                                            {...register(`teamMembers.${index}.name` as const, {
                                                required: 'Member name is required',
                                                onChange: debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const searchValue = e.target.value;
                                                    if (searchValue) {
                                                        const result = await searchUser(searchValue);
                                                        // Optional: set state to display results or provide feedback to the user
                                                    }
                                                }, 300), // Debounce time in ms
                                            })}
                                            placeholder="Member name"
                                        />
                                        <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" onClick={addTeamMember} className="mt-2">
                                    Add Team Member
                                </Button>
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Submitting..." : "Submit Team"}
                            </Button>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                        </form>
                    </CardContent>
                </Card>
            )}

        </div>
    )
}