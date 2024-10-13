import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PlusIcon, XIcon, EyeOffIcon, EyeIcon, ArrowLeftIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { setUser } from '@/redux-store/slices/userInfoSlice'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'

interface SocialLinks {
    linkedin?: string;
    github?: string;
}

interface AdminSignupDetails {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    contact_no: string;
    skills: string[];
    biography: string;
    portfolio?: string;
    socialLinks?: SocialLinks;
    api?: string;
}

export default function AdminSignupForm() {

    const dispatch = useAppDispatch();
    const isAdmin = useAppSelector((state) => state.admin);

    const router = useNavigate()
    const [skills, setSkills] = useState<string[]>([])
    const [newSkill, setNewSkill] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AdminSignupDetails>({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            contact_no: '',
            biography: '',
            skills: [],
            portfolio: '',
            socialLinks: {
                linkedin: '',
                github: '',
            },
            api: '',
        }
    });

    const password = watch('password');

    const addSkill = () => {
        if (newSkill.trim() !== '' && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()])
            clearErrors("skills")
            setNewSkill('')
        } else if (newSkill.trim() === '') {
            setError("skills", {
                type: "manual",
                message: "Skill cannot be empty",
            });
        }
    }

    const removeSkill = (skillToRemove: string) => {
        const updatedSkills = skills.filter(skill => skill !== skillToRemove)
        setSkills(updatedSkills)

        if (updatedSkills.length > 0) {
            clearErrors("skills");
        }
    }

    const handleGoBack = () => {
        router('/admin/dl')
    }

    const onSubmit = async ({ confirmPassword, api, ...finalData }: AdminSignupDetails) => {
        if (skills.length === 0) {
            setError("skills", {
                type: "manual",
                message: "At least one skill is required",
            });
            return;
        }

        const finalFormData = {
            ...finalData,
            skills: skills,
        };

        console.log(finalFormData);
        try {
            const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(finalFormData),
                credentials: "include",
            });

            const response = await r.json();

            if ("duplication" in response) {
                // Handle duplication errors
                if (response.duplication.email) {
                    setError("email", { type: "manual", message: "Email already exists" });
                }
                if (response.duplication.username) {
                    setError("username", { type: "manual", message: "Username already exists" });
                }
            } else if ("user" in response) {
                // Success case
                console.log(response.message);
                dispatch(setUser(response.user));
                router("/");
            } else if ("statusCode" in response) {
                // Handle other validation errors
                if (response.email) setError("email", { type: "manual", message: response.email });
                if (response.username) setError("username", { type: "manual", message: response.username });
                if (response.password) setError("password", { type: "manual", message: response.password });
                if (response.general) setError("api", { type: "manual", message: response.general });
            }
        } catch (error) {
            console.error(error);
            setError("api", {
                type: "manual",
                message: "There was an error during signup. Please try again.",
            });
        }
    };


    if (!isAdmin) {
        return (
            <div className="container h-screen mx-auto px-4 py-8">
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="ghost"
                                onClick={handleGoBack}
                                className="flex items-center text-primary hover:text-primary-dark"
                            >
                                <ArrowLeftIcon size={20} className="mr-2" />
                                Go Back
                            </Button>
                        </div>
                        <CardTitle className="text-2xl md:text-3xl font-bold text-center">Admin Signup</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center items-center my-5">
                            <p>You are not authorized to access this page.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={handleGoBack}
                            className="flex items-center text-primary hover:text-primary-dark"
                        >
                            <ArrowLeftIcon size={20} className="mr-2" />
                            Go Back
                        </Button>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-bold text-center">Admin Signup</CardTitle>
                </CardHeader>
                <CardContent>
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
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Enter your email" required
                                    {...register("email", {
                                        required: { value: true, message: "Email is required" },
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })} />
                                {errors.email?.message && (
                                    <span className="text-red-500 text-sm">{errors.email.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                {errors.password?.message && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm password"
                                        className="w-full pr-10"
                                        onPaste={(e) => {
                                            e.preventDefault();
                                            alert('Pasting is not allowed in password');
                                        }}
                                        {...register("confirmPassword", {
                                            required: { value: true, message: "Please confirm your password" },
                                            validate: value => value === password || "Passwords do not match"
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOffIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword?.message && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                )}
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
                                        value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+\/?([a-zA-Z0-9-._~:/?#[\]@!'()*+,;%=]*)?$/,
                                        message: "Enter a valid URL",
                                    },
                                })} />
                            {errors.portfolio?.message && (
                                <span className="text-red-500 text-sm">{errors.portfolio.message}</span>
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
                                        <span className="text-red-500 text-sm">{errors.socialLinks.linkedin.message}</span>
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
                                        <span className="text-red-500 text-sm">{errors.socialLinks.github.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Signing Up" : "Sign Up"}
                        </Button>
                        {errors.api?.message && (
                            <span className="text-red-500 text-sm">
                                {String(errors.api.message)}
                            </span>
                        )}
                    </form>
                    <div className='flex justify-center items-center my-5'>
                        <p>Already have an account? <Link to="/admin/login" className='font-semibold'>Log in</Link></p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}