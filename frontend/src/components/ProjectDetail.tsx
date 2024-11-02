import { useState, useEffect, useCallback } from 'react'
import { useForm, useFieldArray, Controller, Form } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CalendarDays, Users, PenTool, ChevronDown, ChevronUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import LiveAnimation from "./LiveAnimation"
// import { debounce } from 'lodash';
import Navbar from './Navbar'
import { useAppSelector } from '@/redux-store/hooks'
import { useParams } from 'react-router-dom'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'

interface TeamMember {
    fullName: string;
    username: string;
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
const mockUsers = [
    { username: 'johndoe', fullName: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=johndoe' },
    { username: 'janedoe', fullName: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=janedoe' },
    { username: 'bobsmith', fullName: 'Bob Smith', avatar: 'https://i.pravatar.cc/150?u=bobsmith' },
    { username: 'alicejohnson', fullName: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=alicejohnson' },
    { username: 'charliebravo', fullName: 'Charlie Bravo', avatar: 'https://i.pravatar.cc/150?u=charliebravo' },
]

export default function ProjectDetail() {
    const { projectId } = useParams<{ projectId: string }>();
    const [project, setProject] = useState<ProjectFetchingSuccessResponse['project'] | null>(null);
    const [selfTeamData, setSelfTeamData] = useState<ProjectFetchingSuccessResponse['selfTeamData'] | null>(null);

    const [expandedSection, setExpandedSection] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    // const [error, setError] = useState<string | null>(null);
    const [projectSearchErrorCode, setProjectSearchErrorCode] = useState<number>(0);

    const user = useAppSelector(state => state.userInfo);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!user);

    // const [currentFormTotalMembers, setCurrentFormTotalMembers] = useState(0);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [userSuggestions, setUserSuggestions] = useState<typeof mockUsers>([])

    const [searchQuery, setSearchQuery] = useState('');

    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Team>({
        defaultValues: {
            name: '',
            description: '',
            teamMembers: []
        }
    })

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'teamMembers'
    })

    const onSubmit = (data: Team) => {
        console.log(data)
        // Here you would typically send the data to your backend
    }
    const MAX_TEAM_MEMBERS = 4

    const searchUsers = (query: string) => {
        return mockUsers.filter(user => {
            const isNotInTeam = fields.every(member => member.username !== user.username);
            const matchesQuery = user.username.toLowerCase().includes(query.toLowerCase()) ||
                user.fullName.toLowerCase().includes(query.toLowerCase());

            return isNotInTeam && matchesQuery;
        });
    };

    const handleUserSearch = useCallback((query: string) => {
        if (query.length > 1) {
            const suggestions = searchUsers(query)
            setUserSuggestions(suggestions)
        } else {
            setUserSuggestions([])
        }
    }, [])

    const addTeamMember = useCallback((user: typeof mockUsers[0]) => {
        if (fields.length < MAX_TEAM_MEMBERS && !fields.some(member => member.username === user.username)) {
            append({ ...user, participatingStatus: 'pending' });
            setUserSuggestions([]);
            setSearchQuery(''); 
        }
    }, [fields, append]);


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


    // console.log("Is logged in:", isLoggedIn);
    // console.log("Self Team Data is null:", selfTeamData === null);
    // console.log("Registration date:", project && new Date().getTime() > new Date(project.registrationStart).getTime());
    // console.log("Current Date:", new Date(Date.now()).getTime());
    // console.log("Registration end date:", project && new Date().getTime() < new Date(project.registrationEnd).getTime());

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
                            <Card className="w-full">
                                <CardHeader className="bg-primary text-primary-foreground">
                                    <CardTitle className="text-2xl">Create a Team</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div>
                                            <Label htmlFor="name" className="text-lg font-semibold">Team Name</Label>
                                            <Input
                                                id="name"
                                                {...register('name', { required: 'Team name is required' })}
                                                className="mt-1"
                                            />
                                            {errors.name && <p className="text-destructive text-sm mt-1 text-red-700">{errors.name.message}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="description" className="text-lg font-semibold">Team Description</Label>
                                            <Textarea
                                                id="description"
                                                {...register('description', { required: 'Description is required' })}
                                                className="mt-1"
                                                rows={4}
                                            />
                                            {errors.description && <p className="text-destructive text-sm mt-1 text-red-700">{errors.description.message}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="username" className="text-lg font-semibold">Add Team Member (optional)</Label>
                                            <div className="relative">
                                                <Input
                                                    id="username"
                                                    placeholder="Search by username or full name"
                                                    value={searchQuery}
                                                    onChange={(e) => {
                                                        setSearchQuery(e.target.value);
                                                        handleUserSearch(e.target.value);
                                                    }}
                                                    className="mt-1"
                                                />
                                                {userSuggestions.length > 0 && (
                                                    <ul className="absolute z-10 w-full mt-1 bg-slate-300 border rounded-md shadow-lg">
                                                        {userSuggestions.map((user) => (
                                                            <li
                                                                key={user.username}
                                                                className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center space-x-2"
                                                                onClick={() => {
                                                                    addTeamMember(user)
                                                                } }
                                                            >
                                                                {/* <Avatar>
                                                                    <AvatarImage src={user.avatar} alt={user.fullName} />
                                                                    <AvatarFallback>{user.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                                </Avatar> */}
                                                                <span>{user.fullName} (@{user.username})</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Team Members:</h3>
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="flex items-center justify-between bg-muted p-2 rounded-md mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar>
                                                            <AvatarFallback>{field.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                        </Avatar>
                                                        <span>{field.fullName} (@{field.username})</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {/* <Controller
                                                            name={`teamMembers.${index}.participatingStatus`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
                                                                    <SelectTrigger className="w-[130px]">
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="accepted">Accepted</SelectItem>
                                                                        <SelectItem value="pending">Pending</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        /> */}
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => {
                                                            remove(index);
                                                            setTeamMembers(teamMembers.filter(member => member.username !== field.username));
                                                        }}>
                                                            <X className="h-4 w-4" />
                                                            <span className="sr-only">Remove team member</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <Button type="submit" className="w-full">Create Team</Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                </div>
            </>
        )
    }
}