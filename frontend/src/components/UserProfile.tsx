import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Calendar, CalendarIcon, PlusIcon, XIcon, EyeOffIcon, EyeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import Navbar from './Navbar'
import { useParams } from 'react-router-dom'
import { User } from '@/interfaces'
import Loader from './Loader'
import Footer from './Footer'


interface RequestSuccessResponse {
    user: User;
    selfProfile: boolean;
}

interface FormData extends User {
    password: string;
}

interface SocialLinks {
    linkedin?: string;
    github?: string;
}


interface IUser {
    enrollmentNumber?: string;
    username: string;
    email: string;
    fullName: string;
    profile_pic?: string;
    contact_no?: string;
    skills: string[];
    biography?: string;
    portfolio?: string;
    socialLinks?: SocialLinks;
    participationHistory?: ParticipationHistory[];
    availability?: boolean;
    registrationDate?: Date;
}

interface ParticipationHistory {
    eventId: string;
    eventName: string;
    date: string;
}

interface RequestSuccessResponse {
    user: User;
    selfProfile: boolean;
}

export default function UserProfile() {

    const { username } = useParams<{ username: string }>();

    const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false)
    const [skills, setSkills] = useState<string[]>(user?.skills || []);
    const [newSkill, setNewSkill] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [initialValues, setInitialValues] = useState<User | null>(null);
    const [updatingProfile, setUpdatingProfile] = useState<boolean>(false);


    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: {
            username: '',
            fullName: '',
            password: '',
            contact_no: '',
            biography: '',
            skills: [],
            portfolio: '',
            socialLinks: {
                linkedin: '',
                github: '',
            },
            availability: false,
        }
    });

    useEffect(() => {
        setLoading(true);
        const fetchUser = async () => { 
            try {
                const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${username}`, {
                    method: "GET",
                    credentials: "include",
                });

                const result = await r.json();
                console.log(result);

                if ((result as RequestSuccessResponse).user) {
                    console.log("Hello World");
                    setUser((result as RequestSuccessResponse).user);
                    reset({
                        username: user?.username || "",
                        fullName: user?.fullName || '',
                        password: '',
                        contact_no: user?.contact_no || '',
                        biography: user?.biography || '',
                        skills: user?.skills || [],
                        portfolio: user?.portfolio || '',
                        socialLinks: {
                            linkedin: user?.socialLinks?.linkedin || '',
                            github: user?.socialLinks?.github || '',
                        },
                        availability: user?.availability || false,
                    });
                    setIsOwnProfile((result as RequestSuccessResponse).selfProfile);
                } else if (r.status === 500) {
                    setUser(undefined);
                } else if (r.status === 404) {
                    setUser(null);
                }
            } catch (error) {
                console.error(error);
                setUser(undefined);
            }
            setLoading(false);
        }
        fetchUser();
    }, [username, reset])

    useEffect(() => {
        if (user) {
            reset({
                username: user.username || '',
                fullName: user.fullName || '',
                password: '',
                contact_no: user.contact_no || '',
                biography: user.biography || '',
                skills: user.skills || [],
                portfolio: user.portfolio || '',
                socialLinks: {
                    linkedin: user.socialLinks?.linkedin || '',
                    github: user.socialLinks?.github || '',
                },
                availability: user.availability || false,
            });
            setSkills(user.skills || []);
            setInitialValues(user);

            console.log(`Initial Values are: ${JSON.stringify(initialValues)}`);
        }
    }, [user, reset]);


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

    const onSubmit = async (data: any) => {
        setUpdatingProfile(true);
        if (skills.length === 0) {
            setError("skills", {
                type: "manual",
                message: "At least one skill is required",
            });
            return;
        }

        let changedFields: Partial<FormData> = {};

        if (data.password && data.password.trim() !== "") {
            changedFields.password = data.password;
        }

        if (data.username !== initialValues?.username) changedFields.username = data.username;
        if (data.fullName !== initialValues?.fullName) changedFields.fullName = data.fullName;
        if (data.contact_no !== initialValues?.contact_no) changedFields.contact_no = data.contact_no;
        if (data.biography !== initialValues?.biography) changedFields.biography = data.biography;
        if (JSON.stringify(data.skills) !== JSON.stringify(skills)) changedFields.skills = skills;
        if (data.portfolio !== initialValues?.portfolio) changedFields.portfolio = data.portfolio;
        if (data.socialLinks.linkedin !== initialValues?.socialLinks?.linkedin) changedFields.socialLinks = { ...changedFields.socialLinks, linkedin: data.socialLinks.linkedin };
        if (data.socialLinks.github !== initialValues?.socialLinks?.github) changedFields.socialLinks = { ...changedFields.socialLinks, github: data.socialLinks.github };
        if (data.availability !== initialValues?.availability) changedFields.availability = data.availability;

        console.log(changedFields);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/update-profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(changedFields),
                credentials: "include",
            });

            const result = await response.json();
            console.log(result);

            if (JSON.stringify(result).includes("duplication") && response.status === 400) {
                setError("username", {
                    type: "manual",
                    message: "Username already exists.",
                })
            }
            if (response.ok) {
                setIsEditing(false);
                setUser(result.user);
                setInitialValues(result.user);
                setSkills(result.user.skills || []);
            }

        } catch (error) {
            console.error(error);
            setError("root", {
                type: "manual",
                message: "There was an error updating the profile. Please try again.",
            });
        } finally {
            setUpdatingProfile(false);
        }
    };


    if (loading) {
        return <Loader />;
    }
    if (updatingProfile) {
        return (
            <>
                <Loader />
                <h1 className='text-black font-semibold'>Updating profile</h1>
            </>
        )
    }
    // if (!user) {
    //     return (
    //         <>
    //             <Navbar userType='student' />
    //             <div className="flex flex-col items-center justify-center h-screen">
    //                 <h1 className="text-3xl font-bold mb-4">User not found</h1>
    //                 <p className="text-gray-600">The user you are looking for does not exist.</p>
    //             </div>
    //         </>
    //     );
    // }
    if (user === undefined) {
        return (
            <>
                <Navbar userType='student' />
                <div className="flex flex-col items-center justify-center h-screen">
                    <div className='h-3/4'>
                        <h1 className="text-3xl font-bold mb-4">There was some error</h1>
                    </div>
                    {/* <p className="text-gray-600">The user you are looking for does not exist.</p> */}
                </div>
            </>
        );
    }
    if (user === null) {
        return (
            <>
                <Navbar userType='student' />
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-3xl font-bold mb-4">User not found</h1>
                    <p className="text-gray-600">The user you are looking for does not exist.</p>
                </div>
            </>
        );
    }
    if (user) {
        return (
            <>
                <Navbar userType='student' />
                <div className="flex flex-row justify-center mt-14 h-screen bg-transparent text-gray-900 p-6 m-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="col-span-1 border rounded-lg bg-white/50">
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center">
                                        <Avatar className="w-48 h-48 mb-4 border-4 border-sky-600">
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
                                                    <LinkedInLogoIcon className="w-6 h-6 hover:text-blue-600 transition-colors duration-200" />
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
                                                <span>{user.registrationDate
                                                    ? `Joined ${new Date(user.registrationDate).toLocaleDateString('en-CA')}`
                                                    : 'Joining date not available'}</span>
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

                            <Card className="col-span-1 md:col-span-2 border rounded-lg bg-white/60">
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold mb-4">General Information</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">About me</h3>
                                            <p className="text-gray-600">{user.biography}</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
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
                                                        {user.availability ? "Currently available for projects" : "Currently unavailable for projects"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h2 className="text-xl font-semibold mb-4">Participation History</h2>
                                            {
                                                user.participationHistory?.length === 0 && (
                                                    <p className="text-gray-600">No participation history available</p>
                                                )
                                            }
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
                                                            placeholder="Leave blank if you don't want to change"
                                                            className="w-full pr-10"
                                                            onPaste={(e) => {
                                                                e.preventDefault();
                                                                alert('Pasting is not allowed in password');
                                                            }}
                                                            {...register("password", {
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
                                                <div className="space-y-2">
                                                    <Label htmlFor="contact_no">Contact Number</Label>
                                                    <Input id="contact_no" placeholder="Enter your contact number" required
                                                        {...register("contact_no", {
                                                            required: { value: true, message: "Contact number is required" },
                                                        })} />
                                                    {errors.contact_no?.message && (
                                                        <span className="text-red-500 text-sm">{errors.contact_no.message}</span>
                                                    )}
                                                </div>
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
                                                    {...register("portfolio", {
                                                        pattern: {
                                                            value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+\/?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;%=]*)?$/,
                                                            message: "Enter a valid URL",
                                                        },
                                                    })} />
                                                {errors.portfolio?.message && (
                                                    <span className="text-red-500 text-sm">
                                                        {String(errors.portfolio.message)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Social Links (Optional)</Label>
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                    <div className='space-y-2'>
                                                        <Input id="linkedin" placeholder="LinkedIn URL" {
                                                            ...register("socialLinks.linkedin", {
                                                                pattern: {
                                                                    value: /^(https?:\/\/)?(www\.)?linkedin.com\/in\/[a-zA-Z0-9-]+\/?$/,
                                                                    message: "Enter a valid LinkedIn URL",
                                                                },
                                                            })
                                                        } />
                                                        {errors.socialLinks?.linkedin?.message && (
                                                            <span className="text-red-500 text-sm">
                                                                {String(errors.socialLinks?.linkedin?.message)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className='space-y-2'>
                                                        <Input id="github" placeholder="GitHub URL" {
                                                            ...register("socialLinks.github", {
                                                                pattern: {
                                                                    value: /^(https?:\/\/)?(www\.)?github.com\/[a-zA-Z0-9-]+\/?$/,
                                                                    message: "Enter a valid GitHub URL",
                                                                },
                                                            })
                                                        } />
                                                        {errors.socialLinks?.github?.message && (
                                                            <span className="text-red-500 text-sm">
                                                                {String(errors.socialLinks?.github?.message)}
                                                            </span>
                                                        )}
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
                                                        <div className={`absolute left-1 top-1 bg-black rounded-full w-5 h-5 transition ${watch('availability') ? 'transform translate-x-full bg-stone-800' : ''}`}></div>
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

                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </>
        )
    }

}