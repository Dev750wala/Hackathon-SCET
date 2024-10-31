'use client'

import React, { useState, useEffect } from 'react'
import { format } from "date-fns"
import { Calendar as CalendarIcon, FilterIcon, UserIcon, FolderIcon, GlobeIcon } from "lucide-react"
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
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
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
import { searchingSuccessResponse, UserSearchSuccess, ProjectSearchSuccess } from '@/interfaces'

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

// const projects: ProjectSearchSuccess[] = [
//     {
//         id: "1",
//         name: "AI-Powered Smart City",
//         description: "Develop an AI system to optimize traffic flow, energy usage, and waste management in urban areas.",
//         start: new Date("2023-09-01"),
//         end: "2023-12-31",
//         maxParticipants: 50,
//         techTags: ["AI", "IoT", "Big Data", "Cloud Computing"],
//         status: "ongoing",
//         organizer: { name: "TechInnovate Labs", id: "org1" }
//     },
// ];


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
    const [users, setUsers] = useState<UserSearchSuccess[]>([]);
    const [projects, setProjects] = useState<ProjectSearchSuccess[]>([]);

    const [searchTerm, setSearchTerm] = useState<string>('')
    const [filters, setFilters] = useState<Filters>({
        username: false,
        fullName: false,
        role: '',
        available: false,
        projectName: false,
        dateRange: undefined,
        organizer: false,
        status: "",
        // TODO - Add more filters like below
        // skills: [],
        // techTags: [],
        maxParticipants: 'Select Max Participants',
    })
    const [activeTab, setActiveTab] = useState('users')
    const [isRequestSent, setIsRequestSent] = useState(false);

    const handleFilterChange = (key: keyof Filters, value: any) => {
        console.log("Key: ", key, "Value: ", value);
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    useEffect(() => {
        const delay = 500;

        console.log("Current filters:", filters);
        console.log("Current searchTerm:", searchTerm);

        // Construct query parameters
        const queryParams: Record<string, string> = {};
        Object.keys(filters).forEach((key) => {
            const value = filters[key as keyof Filters];
            if (value !== undefined && value !== null) {
                queryParams[key] = typeof value === "object" ? JSON.stringify(value) : String(value);
            }
        });
        const queryString = new URLSearchParams(queryParams).toString();

        const timeoutId = setTimeout(async () => {
            try {
                console.log("Attempting to send request...");
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/search?${queryString}&inputText=${searchTerm}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json() as searchingSuccessResponse;
                console.log("Request Sent-------------------------");
                console.log("Response Data:", data);
                setUsers(data.users)
                setProjects(data.projects)
                setIsRequestSent(true);

            } catch (error) {
                console.error("An error occurred during fetch:", error);
            }
        }, delay);

        return () => {
            clearTimeout(timeoutId);
            setIsRequestSent(false);
        };
    }, [filters, searchTerm]);

    // Log state of request after effect has been applied
    useEffect(() => {
        if (isRequestSent) {
            console.log("A search request has been sent.");
        } else {
            console.log("Waiting to send a search request...");
        }
    }, [isRequestSent]);


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
                        {/* <Button type="submit">
                            <SearchIcon className="mr-2 h-4 w-4" /> Search
                        </Button> */}
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
                            <UserCard users={users} />
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
                    <Select onValueChange={(value: "student" | "organizer") => handleFilterChange("role", value)}>
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
                    onChange={(e) => handleFilterChange('maxParticipants', Math.max(1, parseInt(e.target.value) || 1))}
                    step={2}
                    min={1}
                    onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        if (parseInt(target.value) < 1) target.value = '1';
                    }}
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



// import { Link } from 'react-router-dom';
// import { CalendarIcon, GlobeIcon } from '@heroicons/react/outline';
// import Badge from './Badge';

function UserCard({ users }: { users: UserSearchSuccess[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 auto-rows-fr">
            {users.map((user) => (
                <Link to={`/${user.username}`} key={user.username}>
                    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md transition-all hover:shadow-lg duration-300 space-y-4 hover:border-neutral-950/65">
                        <div className="flex justify-between">
                            <h3 className="text-lg font-bold truncate">{user.fullName}</h3>
                            {/* <span
                                className={`px-2 pt-1 rounded-lg text-xs font-semibold ${user.role === 'student' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                {user.role}
                            </span> */}
                            <Badge variant={'secondary'} className={` rounded-lg text-xs font-semibold ${user.role === 'student' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                {user.role}
                            </Badge>
                        </div>

                        <p className="text-sm text-gray-500">@{user.username}</p>
                        <p className="text-sm text-gray-700 ">{user.biography}</p>

                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                                <p>
                                    Available: <span className="font-medium">{user.availability ? 'Yes' : 'No'}</span>
                                </p>
                            </div>
                        </div>


                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {user.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                </Badge>
                            ))}
                        </div>


                        {/* Social Links and Portfolio
                        <div className='flex flex-row justify-start gap-3'>
                            {user.portfolio && (
                                <span className="flex items-center space-x-2 mt-3">
                                    <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                                        <GlobeIcon className="w-5 h-5 hover:text-black transition-colors duration-200" />
                                    </a>
                                </span>
                            )}

                            <div className="flex gap-3 mt-3">
                                {user.socialLinks?.github && (
                                    <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                                        <GitHubLogoIcon className="w-5 h-5 hover:text-black transition-colors duration-200" />
                                    </a>
                                )}
                                {user.socialLinks?.linkedin && (
                                    <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
                                        <LinkedInLogoIcon className="w-5 h-5 hover:text-black transition-colors duration-200" />
                                    </a>
                                )}
                            </div>
                        </div> */}
                    </div>
                </Link>
            ))}
        </div>
    );
}
