import { useState, useEffect } from 'react'
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
import Navbar from './Navbar'
import { useAppSelector } from '@/redux-store/hooks'
import { useParams } from 'react-router-dom'

interface TeamMember {
    name: string;
    participatingStatus: 'accepted' | 'pending';
}

interface Team {
    name: string;
    description: string;
    teamMembers: TeamMember[];
}

interface Project {
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
interface ProjectFetchingSuccessResponse {
    project: Project;
    selfTeamData: {
        name: string;
        description: string;
        teamMembers: {
            username: string;
            fullName: string;
            participatingStatus: string;
        }[];
    } | null;
}

export default function ProjectDetail() {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<ProjectFetchingSuccessResponse['project'] | null>(null);
    const [selfTeamData, setSelfTeamData] = useState<ProjectFetchingSuccessResponse['selfTeamData'] | null>(null);

    const [expandedSection, setExpandedSection] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const [projectSearchErrorCode, setProjectSearchErrorCode] = useState<number>(0);

    const user = useAppSelector(state => state.userInfo);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!user);

    const [currentFormTotalMembers, setCurrentFormTotalMembers] = useState(0);

    useEffect(() => {
        setIsLoggedIn(!!user);
    }, [user]);

    useEffect(() => {
        setLoading(true);
        const fetchProject = async () => {
            try {
                const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/${projectId}`, {
                    method: "GET",
                    credentials: "include",
                })
                // console.log((await r.json() as ProjectFetchingSuccessResponse).project);
                const response = await r.json();
                if (r.ok) {
                    const project = (response as ProjectFetchingSuccessResponse).project;
                    console.log("Project fetched:", project);
                    setProject(project);
                    setSelfTeamData((response as ProjectFetchingSuccessResponse).selfTeamData);
                    setLoading(false);
                } else if (r.status === 404) {
                    console.error("Project not found");
                    setProjectSearchErrorCode(404);
                    setProject(null);
                    setLoading(false);
                } else if (r.status === 500) {
                    console.error("Internal server error");
                    setProjectSearchErrorCode(500);
                    setProject(null);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching project:", error);
                setProjectSearchErrorCode(500);
                setLoading(false);
            }
        }
        fetchProject()

    }, [projectId])

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
        // console.log("Hello")
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/search?username=${username}`, {
                method: "GET",
                credentials: "include",
            });
            // console.log(await response.json());

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


    console.log("Is logged in:", isLoggedIn);
    console.log("Self Team Data is null:", selfTeamData === null);
    console.log("Registration date:", project && new Date().getTime() > new Date(project.registrationStart).getTime());
    console.log("Current Date:", new Date(Date.now()).getTime());
    console.log("Registration end date:", project && new Date().getTime() < new Date(project.registrationEnd).getTime());

    if (!project && projectSearchErrorCode === 404) {
        return <div className="container mx-auto p-4">Project not found.</div>
    } else if (!project && projectSearchErrorCode === 500) {
        return <div className="container mx-auto p-4">Sorry, Some unexpected error occurred.</div>
    } else if (loading) {
        return <div className="container mx-auto p-4">Loading project details...</div>
    } else if (project !== null) {
        return (
            <>
                <Navbar />
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
                                        <span><span className="font-bold">Max Participants per Team:</span> {project.maxParticipants}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 mr-1">
                                        <Users className="text-muted-foreground" />
                                        <span><span className="font-bold">Total Teams Participated:</span> {project.totalTeams}</span>
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
                                                <p>{judge.name}</p>
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

                    {
                        isLoggedIn &&
                        selfTeamData !== null &&
                        new Date().getTime() > new Date(project.registrationStart).getTime() &&
                        new Date().getTime() < new Date(project.registrationEnd).getTime() && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Team</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Team Name</Label>
                                            <p>{selfTeamData.name}</p>
                                        </div>
                                        <div>
                                            <Label>Team Description</Label>
                                            <p>{selfTeamData.description}</p>
                                        </div>
                                        <div>
                                            <Label>Team Members</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {selfTeamData.teamMembers.map((member, index) => (
                                                    <div key={index}>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <div className="flex items-center space-x-2 cursor-pointer">
                                                                    <TooltipTrigger asChild>
                                                                        <div className="flex flex-row justify-center items-center gap-2">
                                                                            <Avatar>
                                                                                <AvatarFallback>{member.username[0].toUpperCase()}</AvatarFallback>
                                                                            </Avatar>
                                                                            <span className="font-medium">{member.username}</span>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                </div>
                                                                <TooltipContent side="right">
                                                                    <p>{member.fullName}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    }

                    {
                        isLoggedIn &&
                        selfTeamData === null &&
                        new Date().getTime() > new Date(project.registrationStart).getTime() &&
                        new Date().getTime() < new Date(project.registrationEnd).getTime() && (
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
                                            <div><Label>Team Members</Label></div>
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="flex items-center space-x-2 mt-2">
                                                    <Input
                                                        {...register(`teamMembers.${index}.name` as const, {
                                                            required: 'Member name is required',
                                                            onChange: debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
                                                                const searchValue = e.target.value;
                                                                if (searchValue) {
                                                                    console.log("Searching for user with username:", searchValue);

                                                                    const result = await searchUser(searchValue);
                                                                    console.log(`The below result for it: ${JSON.stringify(result[0])}`);
                                                                }
                                                            }, 750),
                                                        })}
                                                        placeholder="Find with username"
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
            </>
        )
    }
}