'use client'

import React, { useState } from 'react'
import { format } from "date-fns"
import { Calendar as CalendarIcon, FilterIcon, SearchIcon, UserIcon, FolderIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface User {
    id: number;
    username: string;
    fullName: string;
    skills: string[];
    role: 'student' | 'organizer';
    available: boolean;
}

interface Project {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    organizer: string;
    status: 'planned' | 'ongoing' | 'completed';
    techTags: string[];
    maxParticipants: number;
}

const users: User[] = [
    { id: 1, username: 'johndoe', fullName: 'Dev Sadisatsowala', skills: ['JavaScript', 'React'], role: 'student', available: true },
    { id: 2, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 2, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 2, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 2, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 2, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 2, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 2, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 2, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
]

const projects: Project[] = [
    { id: 1, name: 'Web App Project', startDate: '2024-03-01', endDate: '2024-06-30', organizer: 'Tech Corp', status: 'ongoing', techTags: ['React', 'Node.js'], maxParticipants: 5 },
    { id: 2, name: 'AI Research', startDate: '2024-05-01', endDate: '2024-08-31', organizer: 'AI Institute', status: 'planned', techTags: ['Python', 'TensorFlow'], maxParticipants: 3 },
]

interface Filters {
    username: boolean;
    fullName: boolean;
    // skills: string[];
    role: 'student' | 'organizer' | '';
    available: boolean;
    projectName: boolean;
    dateRange: DateRange | undefined;
    organizer: boolean;
    status: boolean;
    // techTags: string[];
    maxParticipants: number | string;
}

export default function AdvancedSearch() {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [filters, setFilters] = useState<Filters>({
        username: false,
        fullName: false,
        // skills: [],
        role: '',
        available: false,
        projectName: false,
        dateRange: undefined,
        organizer: false,
        status: false,
        // techTags: [],
        maxParticipants: 'Select Max Participants',
    })
    const [activeTab, setActiveTab] = useState('users')

    const handleFilterChange = (key: keyof Filters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Searching with term:', searchTerm, 'and filters:', filters)
        // Implement actual search logic here
    }

    return (
        <div className="min-h-screen bg-white">
            <header className="sticky top-0 z-10 backdrop-blur-xl border-b">
                <div className="container mx-auto px-4 py-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            type="search"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow"
                        />
                        <Button type="submit">
                            <SearchIcon className="mr-2 h-4 w-4" /> Search
                        </Button>
                    </form>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
                {/* larger screens */}
                <aside className="w-full md:w-64 space-y-6 hidden md:block sticky top-24 self-start">
                    <FiltersContent filters={filters} handleFilterChange={handleFilterChange} />
                </aside>

                {/* Mobile */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="md:hidden mb-4">
                            <FilterIcon className="mr-2 h-4 w-4" /> Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle>Search Filters</SheetTitle>
                            <SheetDescription>
                                Customize your search with these filters.
                            </SheetDescription>
                        </SheetHeader>
                        <FiltersContent filters={filters} handleFilterChange={handleFilterChange} />
                    </SheetContent>
                </Sheet>

                {/* Main content area */}
                <div className="flex-grow space-y-6">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
                        <TabsList>
                            <TabsTrigger value="users">
                                <UserIcon className="mr-2 h-4 w-4" /> Users
                            </TabsTrigger>
                            <TabsTrigger value="projects">
                                <FolderIcon className="mr-2 h-4 w-4" /> Projects
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="users" className="space-y-4">
                            {users.map((user) => (
                                <UserCard key={user.id} user={user} />
                            ))}
                        </TabsContent>
                        <TabsContent value="projects" className="space-y-4">
                            {projects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );

}

interface FiltersContentProps {
    filters: Filters;
    handleFilterChange: (key: keyof Filters, value: any) => void;
}

function FiltersContent({ filters, handleFilterChange }: FiltersContentProps) {
    return (
        <div className="space-y-6 pl-4 h-full">
            <div>
                <h3 className="mb-6 font-bold text-lg">User Filters</h3>
                <div className="flex items-center space-x-2 my-4">
                    <Checkbox
                        id="username"
                        checked={filters.username}
                        onCheckedChange={(checked: boolean) => handleFilterChange('username', checked)}
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        username
                    </label>
                </div>
                <div className="flex items-center space-x-2 my-4">
                    <Checkbox
                        id="username"
                        checked={filters.fullName}
                        onCheckedChange={(checked: boolean) => handleFilterChange('fullName', checked)}
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Full name
                    </label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="available"
                        checked={filters.available}
                        onCheckedChange={(checked: boolean) => handleFilterChange('available', checked)}
                    />
                    <Label htmlFor="available">Available Only</Label>
                </div>

                <div className='my-4'>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="organizer">Organizer</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <h3 className="mb-6 font-bold text-lg">Project Filters</h3>
                <div className="flex items-center space-x-2 my-4">
                    <Checkbox
                        id="username"
                        checked={filters.projectName}
                        onCheckedChange={(checked: boolean) => handleFilterChange('projectName', checked)}
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Project Name
                    </label>
                </div>

                <div className="flex items-center space-x-2 my-4">
                    <Checkbox
                        id="organizer"
                        checked={filters.organizer}
                        onCheckedChange={(checked: boolean) => handleFilterChange('organizer', checked)}
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Organizer
                    </label>
                </div>

                <DatePickerWithRange
                    dateRange={filters.dateRange}
                    onChange={(range) => handleFilterChange('dateRange', range)}
                />

                <div className='my-4'>
                    <Select
                        onValueChange={(value: 'planned' | 'ongoing' | 'completed') => handleFilterChange('status', value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select Status</SelectLabel>
                                <SelectItem value="planned">Planned</SelectItem>
                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* <Input
                    placeholder="Tech Tags (comma-separated)"
                    value={filters.techTags.join(', ')}
                    onChange={(e) => handleFilterChange('techTags', e.target.value.split(', '))}
                    className="mb-2"
                /> */}
                <Input
                    type="number"
                    placeholder="Max Participants"
                    value={filters.maxParticipants}
                    onChange={(e) => handleFilterChange('maxParticipants', e.target.value)}
                />
            </div>
        </div>
    )
}

interface DatePickerWithRangeProps {
    dateRange: DateRange | undefined;
    onChange: (range: DateRange | undefined) => void;
}

function DatePickerWithRange({ dateRange, onChange }: DatePickerWithRangeProps) {
    return (
        <div className={cn("grid gap-2 my-4")}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateRange && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={onChange}
                        numberOfMonths={1}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}



function UserCard({ user }: { user: User }) {
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-md transition-all hover:shadow-lg duration-300">
            <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
                    {user.fullName[0]}
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">{user.fullName}</h3>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Skills:</span> {user.skills.join(', ')}</p>
                <p><span className="font-semibold">Role:</span> {user.role}</p>
                <p><span className="font-semibold">Available:</span> {user.available ? 'Yes' : 'No'}</p>
            </div>
            <Button variant="link" className="mt-4 text-blue-500 hover:underline p-0">View Profile</Button>
        </div>
    )
}


function ProjectCard({ project }: { project: Project }) {
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-md transition-all hover:shadow-lg duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h3>
            <p className="text-sm text-gray-500 mb-4">Organizer: <span className="text-gray-700 font-medium">{project.organizer}</span></p>

            <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Status:</span> {project.status}</p>
                <p><span className="font-semibold">Date:</span> {project.startDate} - {project.endDate}</p>
                <p><span className="font-semibold">Tech Tags:</span> {project.techTags.join(', ')}</p>
                <p><span className="font-semibold">Max Participants:</span> {project.maxParticipants}</p>
            </div>

            <Button variant="link" className="mt-4 text-blue-500 hover:underline p-0">View Project</Button>
        </div>
    )
}
