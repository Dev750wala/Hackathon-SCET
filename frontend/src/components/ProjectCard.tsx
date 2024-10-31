import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, UsersIcon, UserIcon } from "lucide-react"
import { ProjectSearchSuccess } from "@/interfaces"

export interface Project {
    id: string
    name: string
    description: string
    start: string
    end?: string
    maxParticipants: number
    techTags: string[]
    status: 'planned' | 'ongoing' | 'completed'
    organizer: {
        name: string
        id: string
    }
}

interface ProjectCardsProps {
    projects: ProjectSearchSuccess[]
}

export function ProjectCards({ projects }: ProjectCardsProps) {
    if (!projects || projects.length === 0) {
        return <div className="text-center p-6 mt-20">No projects available at the moment.</div>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {projects.map((project) => (
                <Card key={project.id} className="flex flex-col h-full">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg font-bold truncate">{project.name}</CardTitle>
                            <Badge variant={project.status === 'planned' ? 'secondary' : project.status === 'ongoing' ? 'default' : 'outline'}>
                                {project.status}
                            </Badge>
                        </div>
                        <CardDescription className="text-sm text-muted-foreground line-clamp-2 h-10 overflow-hidden">
                            {project.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow overflow-auto py-2">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                            <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                                {new Date(project.start).toLocaleDateString()} -
                                {project.end ? new Date(project.end).toLocaleDateString() : 'Ongoing'}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                            <UsersIcon className="h-4 w-4 flex-shrink-0" />
                            <span>Max Participants: {project.maxParticipants}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <UserIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">Organizer: {project.organizer.fullName}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-wrap gap-2 pt-2">
                        {project.techTags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}