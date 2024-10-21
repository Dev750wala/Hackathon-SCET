// import { useParams } from "react-router-dom"
import { ProjectFetchingSuccessResponse } from "@/interfaces"
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CalendarDays, Users, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Label } from "@radix-ui/react-label"
import { Link } from "react-router-dom"
import LiveAnimation from "./LiveAnimation"

const demoProject: ProjectFetchingSuccessResponse = {
    id: "hack-2023-01",
    name: "TechInnovate Hackathon 2023",
    description: "Join us for a 48-hour coding marathon to solve real-world problems using cutting-edge technologies!",
    registrationStart: new Date("2023-08-01T00:00:00Z"),
    registrationEnd: new Date("2023-08-31T23:59:59Z"),
    start: new Date("2023-09-15T09:00:00Z"),
    // end: new Date("2023-09-17T09:00:00Z"),
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
};

interface TeamMember {
    name: string;
    participatingStatus: 'accepted' | 'pending';
}

interface Team {
    name: string;
    description: string;
    teamMembers: TeamMember[];
}

const ProjectDetail = ({ isLoggedIn = true }: { isLoggedIn?: boolean }) => {

    const project = demoProject
    const [expandedSection, setExpandedSection] = useState<string | null>(null)
    const [team, setTeam] = useState<Team>({ name: '', description: '', teamMembers: [] })
    const [newMember, setNewMember] = useState<string>('')

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

    const handleTeamSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send this data to your backend
        console.log('Team submitted:', team)
    }

    const addTeamMember = () => {
        if (newMember) {
            setTeam(prev => ({
                ...prev,
                teamMembers: [...prev.teamMembers, { name: newMember, participatingStatus: 'pending' }]
            }))
            setNewMember('')
        }
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

                            {
                                project.start < new Date() && (!project.end || project.end > new Date()) ? (
                                    <div className="flex items-center justify-start space-x-2">
                                        <span className="rounded-full w-fit overflow-hidden flex flex-row justify-center items-center">
                                            <LiveAnimation />
                                        </span>
                                        <span className="text-green-600 font-bold px-0">Project is live!</span>
                                    </div>

                                ) : (
                                    <div className="flex items-center space-x-2 mr-1">
                                        <CalendarDays className="text-muted-foreground" />
                                        <span>
                                            <span className="font-bold">Event:</span> {formatDate(project.start)}
                                            {
                                                project.end && (
                                                    <span> - {formatDate(project.end)}</span>
                                                )
                                            }
                                        </span>
                                    </div>
                                )
                            }
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
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> */}
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

            {
                isLoggedIn && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Participate in the Hackathon</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleTeamSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="teamName">Team Name</Label>
                                    <Input
                                        id="teamName"
                                        value={team.name}
                                        onChange={(e) => setTeam(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="teamDescription">Team Description</Label>
                                    <Textarea
                                        id="teamDescription"
                                        value={team.description}
                                        onChange={(e) => setTeam(prev => ({ ...prev, description: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="newMember">Add Team Member</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id="newMember"
                                            value={newMember}
                                            onChange={(e) => setNewMember(e.target.value)}
                                        />
                                        <Button type="button" onClick={addTeamMember}>Add</Button>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Team Members</h4>
                                    <ul className="list-disc pl-5">
                                        {team.teamMembers.map((member, index) => (
                                            <li key={index}>
                                                {member.name} - {member.participatingStatus}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button type="submit">Submit Team</Button>
                            </form>
                        </CardContent>
                    </Card>
                )
            }
        </div >
    )


}

export default ProjectDetail