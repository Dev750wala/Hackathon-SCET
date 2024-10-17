'use client'

import { useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Github, Linkedin, Mail, Phone, MapPin, Calendar, Briefcase, Link as LinkIcon, Eye, EyeOff, X, Plus, CalendarIcon, PlusIcon, XIcon, EyeOffIcon, EyeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import Navbar from './Navbar'
import { useAppSelector, useAppDispatch } from '@/redux-store/hooks'

interface SocialLinks {
    linkedin?: string;
    github?: string;
}

interface ParticipationHistory {
    eventId: string;
    eventName: string;
    date: string;
}

interface IUser {
    enrollmentNumber?: string;
    username: string;
    password: string;
    email: string;
    fullName: string;
    profile_pic?: string;
    // contact_no?: string;
    skills?: string[];
    biography?: string;
    portfolio?: string;
    socialLinks?: SocialLinks;
    participationHistory?: ParticipationHistory[];
    availability?: boolean;
    registrationDate?: Date;
    // location?: string;
    // jobTitle?: string;
}

const mockUser: IUser = {
    enrollmentNumber: "EN12345",
    username: "johndoe",
    password: "********",
    email: "john.doe@example.com",
    fullName: "John Doe",
    profile_pic: "/placeholder.svg?height=200&width=200",
    // contact_no: "+1234567890",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "MongoDB"],
    biography: "Passionate developer with 5 years of experience in web technologies. I love creating user-friendly applications and solving complex problems.",
    portfolio: "https://johndoe.dev",
    socialLinks: {
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe"
    },
    availability: true,
    registrationDate: new Date("2021-01-01"),
    // location: "San Francisco, USA",
    // jobTitle: "Full Stack Developer",
    participationHistory: [
        { eventId: "1", eventName: "Web Dev Hackathon 2023", date: "2023-05-15" },
        { eventId: "2", eventName: "AI Conference", date: "2023-07-22" },
        { eventId: "3", eventName: "Open Source Contributors Summit", date: "2023-09-10" },
    ]
}

export default function UserProfile({ user = mockUser, isOwnProfile = true }: { user?: IUser, isOwnProfile?: boolean }) {
    const [isEditing, setIsEditing] = useState(false)
    // const [showPassword, setShowPassword] = useState(false)
    // const { control, handleSubmit, register } = useForm<IUser>({
    //     defaultValues: {
    //         ...user,
    //         socialLinks: {
    //             linkedin: user.socialLinks?.linkedin || '',
    //             github: user.socialLinks?.github || '',
    //         },
    //         skills: user.skills || [],
    //     }
    // })
    // const { fields, append, remove } = useFieldArray({
    //     control,
    //     name: "skills",
    //     rules: { required: "Please add at least one skill" }
    // })

    const dispatch = useAppDispatch();
    // const user = useAppSelector((state) => state.userInfo);

    const [skills, setSkills] = useState<string[]>(user.skills || []);
    const [newSkill, setNewSkill] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<IUser>({
        defaultValues: {
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            password: user.password,
            // contact_no: user.contact_no,
            biography: user.biography,
            skills: skills,
            portfolio: user.portfolio,
            socialLinks: {
                linkedin: user.socialLinks?.linkedin || '',
                github: user.socialLinks?.github || '',
            },
            availability: user.availability,
        }
    });



    const addSkill = () => {
        if (newSkill.trim() !== '' && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            clearErrors("skills");
            setNewSkill('');
        } else if (newSkill.trim() === '') {
            setError("skills", {
                type: "manual",
                message: "Skill cannot be empty",
            });
        }
    };

    const removeSkill = (skillToRemove: string) => {
        const updatedSkills = skills.filter(skill => skill !== skillToRemove);
        setSkills(updatedSkills);

        if (updatedSkills.length > 0) {
            clearErrors("skills");
        }
    };

    const onSubmit = async (data: IUser) => {
        if (skills.length === 0) {
            setError("skills", {
                type: "manual",
                message: "At least one skill is required",
            });
            return;
        }
        const finalData = { ...data, skills: skills };

        console.log(finalData);
        alert("Profile updated successfully!");
        // try {
        //     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/profile`, {
        //         method: "PUT",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(finalData),
        //         credentials: "include",
        //     });

        //     const result = await response.json();
        //     console.log(result);

        //     if ("user" in result) {
        //         // dispatch(setUser(result.user)); // Update Redux store
        //     } else {
        //         // Handle validation or other errors
        //         // Map errors to form fields as necessary
        //     }
        // } catch (error) {
        //     console.error(error);
        //     setError("root", {
        //         type: "manual",
        //         message: "There was an error updating the profile. Please try again.",
        //     });
        // }
    };

    return (
        <>
            <Navbar userType='student' />
            <div className="flex flex-row justify-center items-center min-h-screen bg-white text-gray-900 p-6 m-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="col-span-1 border-none rounded-lg">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center">
                                    <Avatar className="w-32 h-32 mb-4 border-4 border-blue-500">
                                        <AvatarImage src={user.profile_pic} alt={user.fullName} />
                                        <AvatarFallback>
                                            {user.fullName.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h1 className="text-2xl font-bold mb-1">{user.fullName}</h1>
                                    <div className="flex items-center text-gray-600 gap-4 mb-4">
                                        {user.socialLinks?.github && (
                                            <Link to={user.socialLinks.github} aria-label="GitHub" target="_blank">
                                                <GitHubLogoIcon className="w-6 h-6 hover:text-black transition-colors duration-200" />
                                            </Link>
                                        )}
                                        {user.socialLinks?.linkedin && (
                                            <Link to={user.socialLinks.linkedin} aria-label="LinkedIn" target="_blank">
                                                <Linkedin className="w-6 h-6 hover:text-blue-600 transition-colors duration-200" />
                                            </Link>
                                        )}
                                    </div>
                                    <div className="w-full space-y-2 text-gray-700">
                                        <div className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2 text-gray-500" />
                                            <span>{user.email}</span>
                                        </div>
                                        {/* <div className="flex items-center">
                                                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                                <span>{user.contact_no}</span>
                                            </div> 
                                        */}
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                            <span>Joined {user.registrationDate?.toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <h2 className="text-xl font-semibold mb-2">Skills</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {user.skills?.map((skill, index) => (
                                            <Badge key={index} variant="secondary" className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full shadow-sm">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1 md:col-span-2 border-none">
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-bold mb-4">General Information</h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">About me</h3>
                                        <p className="text-gray-600">{user.biography}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">Portfolio</h3>
                                            <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{user.portfolio}</a>
                                        </div>


                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">Availability</h3>
                                            <div className="flex items-center">
                                                <span className={`w-3 h-3 rounded-full mr-2 ${user.availability ? "bg-green-500" : "bg-red-500"
                                                    }`}></span>
                                                <span className={user.availability ? "text-green-600" : "text-red-600"}>
                                                    {user.availability ? "Currently available for projects" : "currently unavailable for projects"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold mb-4">Participation History</h2>
                                        {user.participationHistory?.map((event) => (
                                            <div
                                                key={event.eventName}
                                                className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <CalendarIcon className="w-4 h-4 mr-2" />
                                                <div>
                                                    <p className="text-lg font-medium text-gray-800">{event.eventName}</p>
                                                    <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* <div>
                                        <h3 className="text-xl font-semibold mb-2">Participation History</h3>
                                        <ul className="space-y-2">
                                            {user.participationHistory?.map((event, index) => (
                                                <li key={index} className="flex items-center">
                                                    <Briefcase className="w-4 h-4 mr-2" />
                                                    <span>{event.eventName} - {event.date}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div> */}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {isOwnProfile && (
                        <div className="mt-8 text-center">
                            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                <DialogTrigger asChild>
                                    <Button onClick={() => setIsEditing(true)} size="lg" className="text-lg px-8">Edit Profile</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
                                        <DialogDescription className="text-lg">
                                            Make changes to your profile here. Click save when you're done.
                                        </DialogDescription>
                                    </DialogHeader>





                                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="username">Username</Label>
                                                <Input id="username" placeholder="Choose a username" required
                                                    {...register("username", {
                                                        required: { value: true, message: "Username is required" },
                                                        pattern: {
                                                            value: /^(?=.{7,20}$)[a-z0-9._]+$/,
                                                            message: 'Username must be 7-20 characters long and can only contain lowercase letters, numbers, periods, and underscores',
                                                        },
                                                    })}
                                                />
                                                {errors.username?.message && (
                                                    <span className="text-red-500 text-sm">{errors.username.message}</span>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Enter password"
                                                        className="w-full pr-10"
                                                        onPaste={(e) => {
                                                            e.preventDefault();
                                                            alert('Pasting is not allowed in password');
                                                        }}
                                                        {...register("password", {
                                                            required: { value: true, message: "Password is required" },
                                                            minLength: { value: 10, message: "Password must be at least 10 characters" },
                                                            maxLength: { value: 30, message: "Password must be at most 30 characters" },
                                                        })}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOffIcon className="h-5 w-5" />
                                                        ) : (
                                                            <EyeIcon className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                                {
                                                    errors.password?.message && (
                                                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                                    )
                                                }
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName">Full Name</Label>
                                                <Input id="fullName" placeholder="Enter your full name" required
                                                    {...register("fullName", {
                                                        required: { value: true, message: "Full name is required" },
                                                    })} />
                                                {errors.fullName?.message && (
                                                    <span className="text-red-500 text-sm">{errors.fullName.message}</span>
                                                )}
                                            </div>
                                            {/* <div className="space-y-2">
                                                <Label htmlFor="contact_no">Contact Number</Label>
                                                <Input id="contact_no" placeholder="Enter your contact number" required
                                                    {...register("contact_no", {
                                                        required: { value: true, message: "Contact number is required" },
                                                    })} />
                                                {errors.contact_no?.message && (
                                                    <span className="text-red-500 text-sm">{errors.contact_no.message}</span>
                                                )}
                                            </div> */}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Skills</Label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {skills.map((skill, index) => (
                                                    <span key={index} className="bg-primary text-primary-foreground px-2 py-1 rounded-xl text-sm flex items-center bg-black text-white">
                                                        {skill}
                                                        <button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-primary-foreground">
                                                            <XIcon size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    placeholder="Add a skill"
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                                />
                                                <Button type="button" onClick={addSkill} size="icon">
                                                    <PlusIcon size={20} />
                                                </Button>
                                            </div>
                                            {errors.skills?.message && (
                                                <span className="text-red-500 text-sm">{errors.skills.message}</span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="biography">Biography</Label>
                                            <Textarea id="biography" placeholder="Tell us a bit about yourself" className="min-h-[100px]"
                                                {...register("biography", {
                                                    required: { value: true, message: "Biography is required" },
                                                })} />
                                            {errors.biography?.message && (
                                                <span className="text-red-500 text-sm">{errors.biography.message}</span>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="portfolio">Portfolio URL (Optional)</Label>
                                            <Input id="portfolio" placeholder="https://your-portfolio.com"
                                                {...register("portfolio")} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Social Links (Optional)</Label>
                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                <div className='space-y-2'>
                                                    <Input id="linkedin" placeholder="LinkedIn URL" {...register("socialLinks.linkedin")} />
                                                </div>
                                                <div className='space-y-2'>
                                                    <Input id="github" placeholder="GitHub URL" {...register("socialLinks.github")} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Label htmlFor="availability" className="cursor-pointer">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        id="availability"
                                                        {...register("availability")}
                                                        className="sr-only bg-gray-600 text-white   "
                                                    />
                                                    <div className="block bg-gray-300 rounded-full w-12 h-7"></div>
                                                    <div className={`absolute left-1 top-1 bg-white rounded-full w-5 h-5 transition ${watch('availability') ? 'transform translate-x-full bg-stone-800' : ''}`}></div>
                                                </div>
                                            </Label>
                                            <span>Available for projects</span>
                                        </div>

                                        <Button type="submit" disabled={isSubmitting} className="w-full">
                                            {isSubmitting ? "Updating Profile..." : "Update Profile"}
                                        </Button>
                                        {errors.root?.message && (
                                            <span className="text-red-500 text-sm">{errors.root.message}</span>
                                        )}
                                    </form>






                                    {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Controller
                                                name="username"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex flex-col space-y-1">
                                                        <Label htmlFor="username">Username</Label>
                                                        <Input id="username" {...field} />
                                                    </div>
                                                )}
                                            />
                                            <Controller
                                                name="password"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex flex-col space-y-1">
                                                        <Label htmlFor="password">Password</Label>
                                                        <div className="relative">
                                                            <Input
                                                                id="password"
                                                                type={showPassword ? "text" : "password"}
                                                                {...field}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                                            >
                                                                {showPassword ? (
                                                                    <EyeOff className="h-5 w-5" />
                                                                ) : (
                                                                    <Eye className="h-5 w-5" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            />
                                            <Controller
                                                name="fullName"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex flex-col space-y-1">
                                                        <Label htmlFor="fullName">Full Name</Label>
                                                        <Input id="fullName" {...field} />
                                                    </div>
                                                )}
                                            />
                                            <Controller
                                                name="profile_pic"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex flex-col space-y-1">
                                                        <Label htmlFor="profile_pic">Profile Picture URL</Label>
                                                        <Input id="profile_pic" {...field} />
                                                    </div>
                                                )}
                                            />
                                            <Controller
                                                name="contact_no"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex flex-col space-y-1">
                                                        <Label htmlFor="contact_no">Contact Number</Label>
                                                        <Input id="contact_no" {...field} />
                                                    </div>
                                                )}
                                            />
                                            <div className="flex flex-col space-y-1">
                                                <Label htmlFor="skills">Skills</Label>
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {fields.map((field, index) => (
                                                        <Badge key={field.id} variant="secondary" className="text-sm py-1 px-2">
                                                            {field.value}
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(index)}
                                                                className="ml-2 text-gray-500 hover:text-gray-700"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="flex">
                                                    <Input
                                                        id="newSkill"
                                                        placeholder="Add a skill"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && e.currentTarget.value) {
                                                                e.preventDefault();
                                                                append(e.currentTarget.value);
                                                                e.currentTarget.value = '';
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => {
                                                            const input = document.getElementById('newSkill') as HTMLInputElement;
                                                            if (input.value) {
                                                                append(input.value);
                                                                input.value = '';
                                                            }
                                                        }}
                                                        className="ml-2"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <Controller
                                                name="biography"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex flex-col space-y-1">
                                                        <Label htmlFor="biography">Biography</Label>
                                                        <Textarea id="biography" {...field} />
                                                    </div>
                                                )}
                                            />
                                            <Controller
                                                name="portfolio"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex flex-col space-y-1">
                                                        <Label htmlFor="portfolio">Portfolio</Label>
                                                        <Input id="portfolio" {...field} />
                                                    </div>
                                                )}
                                            />
                                            <Controller
                                                name="socialLinks.linkedin"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex flex-col space-y-1">
                                                        <Label htmlFor="linkedin">LinkedIn</Label>
                                                        <Input id="linkedin" {...field} />
                                                    </div>
                                                )}
                                            />
                                            <Controller
                                                name="socialLinks.github"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex flex-col space-y-1">
                                                        <Label htmlFor="github">GitHub</Label>
                                                        <Input id="github" {...field} />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        <Controller
                                            name="availability"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex items-center justify-end space-x-2 mt-4">
                                                    <Label htmlFor="availability">Available for hire</Label>
                                                    <Switch
                                                        id="availability"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </div>
                                            )}
                                        />
                                        <DialogFooter>
                                            <Button type="submit" size="lg" className="text-lg px-8">Save changes</Button>
                                        </DialogFooter>
                                    </form> */}
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}