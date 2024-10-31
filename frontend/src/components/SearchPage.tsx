'use client'

import React, { useState, useEffect } from 'react'
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
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ProjectCards } from './ProjectCard'
import { Link } from 'react-router-dom'

interface User {
    id: number;
    username: string;
    fullName: string;
    skills: string[];
    role: 'student' | 'organizer';
    available: boolean;
}

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

const users: User[] = [
    { id: 1, username: 'johndoe', fullName: 'Dev Sadisatsowala', skills: ['JavaScript', 'React'], role: 'student', available: true },
    { id: 2, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 3, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 4, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 5, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 6, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 7, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 8, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
    { id: 9, username: 'janedoe', fullName: 'Jane Doe', skills: ['Python', 'Machine Learning'], role: 'organizer', available: false },
]

const projects: Project[] = [
    {
        id: "1",
        name: "AI-Powered Smart City",
        description: "Develop an AI system to optimize traffic flow, energy usage, and waste management in urban areas.",
        start: "2023-09-01",
        end: "2023-12-31",
        maxParticipants: 50,
        techTags: ["AI", "IoT", "Big Data", "Cloud Computing"],
        status: "ongoing",
        organizer: { name: "TechInnovate Labs", id: "org1" }
    },
    {
        id: "2",
        name: "Blockchain for Supply Chain",
        description: "Create a blockchain-based solution to enhance transparency and traceability in global supply chains.",
        start: "2023-10-15",
        maxParticipants: 40,
        techTags: ["Blockchain", "Smart Contracts", "Web3"],
        status: "planned",
        organizer: { name: "BlockChain Ventures", id: "org2" }
    },
    {
        id: "3",
        name: "VR Educational Platform",
        description: "Build a virtual reality platform for immersive educational experiences across various subjects.",
        start: "2023-07-01",
        end: "2023-08-31",
        maxParticipants: 30,
        techTags: ["VR", "Unity", "3D Modeling", "Education Tech"],
        status: "completed",
        organizer: { name: "EduTech Innovations", id: "org3" }
    },
    {
        id: "4",
        name: "Green Energy Marketplace",
        description: "Develop a platform connecting renewable energy producers with consumers, facilitating peer-to-peer energy trading.",
        start: "2023-11-01",
        maxParticipants: 45,
        techTags: ["React", "Node.js", "Smart Grid", "Cryptocurrency"],
        status: "planned",
        organizer: { name: "GreenTech Solutions", id: "org4" }
    },
    {
        id: "5",
        name: "Mental Health AI Chatbot",
        description: "Create an AI-powered chatbot to provide mental health support and resources to users.",
        start: "2023-08-15",
        end: "2023-10-31",
        maxParticipants: 35,
        techTags: ["NLP", "Machine Learning", "Python", "Healthcare"],
        status: "ongoing",
        organizer: { name: "HealthTech Innovators", id: "org5" }
    },
    {
        id: "6",
        name: "Augmented Reality Art Gallery",
        description: "Design an AR app that transforms public spaces into virtual art galleries, showcasing digital artworks.",
        start: "2023-12-01",
        maxParticipants: 25,
        techTags: ["AR", "Unity", "3D Modeling", "Mobile Development"],
        status: "planned",
        organizer: { name: "ArtTech Collective", id: "org6" }
    },
    {
        id: "7",
        name: "Decentralized Finance (DeFi) Platform",
        description: "Build a DeFi platform that offers lending, borrowing, and yield farming services using smart contracts.",
        start: "2023-09-15",
        end: "2024-01-15",
        maxParticipants: 60,
        techTags: ["Ethereum", "Solidity", "Web3.js", "React"],
        status: "ongoing",
        organizer: { name: "DeFi Innovations", id: "org7" }
    },
    {
        id: "8",
        name: "Sustainable Fashion Tracker",
        description: "Create a mobile app that helps consumers track the sustainability and ethical practices of fashion brands.",
        start: "2023-10-01",
        end: "2023-11-30",
        maxParticipants: 20,
        techTags: ["React Native", "Node.js", "MongoDB", "Machine Learning"],
        status: "completed",
        organizer: { name: "EcoFashion Tech", id: "org8" }
    }
];


interface Filters {
    username: boolean;
    fullName: boolean;
    role: 'student' | 'organizer' | '';
    available: boolean;
    projectName: boolean;
    dateRange: DateRange | undefined;
    organizer: boolean;
    status: "student" | "organizer" | "";
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
        status: "",
        // techTags: [],
        maxParticipants: 'Select Max Participants',
    })
    const [activeTab, setActiveTab] = useState('users')

    const handleFilterChange = (key: keyof Filters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    useEffect(() => {
        const queryParams: Record<string, string> = {};

        Object.keys(filters).forEach((key) => {
            const value = filters[key as keyof Filters];

            if (value !== undefined && value !== null) {
                queryParams[key] = typeof value === "object" ? JSON.stringify(value) : String(value);
            }
        });
        const queryString = new URLSearchParams(queryParams).toString();
        console.log('Searching with term:', searchTerm, 'and filters:', filters)

        const getData = async () => {
            const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/search?${queryString}&inputText=${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
            console.log(await r.json());
            
        };
        getData();

    }, [filters, searchTerm])


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
                            {/* {users.map((user) => ( */}
                            <UserCard users={users} />
                            {/* ))} */}
                        </TabsContent>
                        <TabsContent value="projects" className="space-y-4">
                            <ProjectCards projects={projects} />
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



function UserCard({ users }: { users: User[] }) {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
            {users.map((user) => (
                <Link to={`/${user.username}`} >
                    <div key={user.username} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md transition-all hover:shadow-lg duration-300 space-y-4">
                        {/* User Role Badge at the Top Right */}
                        <div className="flex justify-between">
                            <h3 className="text-lg font-bold truncate">{user.fullName}</h3>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'student' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                    }`}
                            >
                                {user.role}
                            </span>
                        </div>

                        <p className="text-sm text-gray-500">@{user.username}</p>

                        {/* Details Section */}
                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                                <p>
                                    Available: <span className="font-medium">{user.available ? 'Yes' : 'No'}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {user.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
