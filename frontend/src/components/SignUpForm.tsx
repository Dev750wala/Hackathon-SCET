import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PlusIcon, XIcon, ArrowLeftIcon, EyeOffIcon, EyeIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useNavigate, Link } from 'react-router-dom';
import { SignUpFormData } from '@/interfaces'
// import Cookies from "js-cookie"
// import axios from "axios"
// import dotenv from "dotenv"
// dotenv.config();

function SignupForm() {
    const [skills, setSkills] = useState<string[]>([])
    const [newSkill, setNewSkill] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            enrollmentNumber: '',
            username: '',
            password: '',
            email: '',
            fullName: '',
            contact_no: '',
            biography: '',
            portfolio: '',
            linkedin: '',
            github: '',
            skills: [],
            api: '',
        }
    });

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
        var updatedSkills = skills.filter(skill => skill !== skillToRemove)
        setSkills(updatedSkills)

        if (updatedSkills.length > 0) {
            clearErrors("skills");
        }
    }

    const handleGoBack = () => {
        navigate(-1);
    };

    const transformData = ({ api, ...data }: SignUpFormData) => {
        return {
            enrollmentNumber: data.enrollmentNumber,
            username: data.username,
            password: data.password,
            email: data.email,
            biography: data.biography,
            fullName: data.fullName,
            contact_no: data.contact_no,
            skills: skills,
            portfolio: data.portfolio,
            socialLinks: {
                linkedin: data.linkedin,
                github: data.github
            }
        };
    };


    const onSubmit = async function (data: any) {
        console.log(`isSubmitting is ${isSubmitting}`);

        if (skills.length === 0) {
            console.log(`The skills length is ${skills.length}`);

            setError("skills", {
                type: "manual",
                message: "At least one skill is required",
            });
            return;
        }
        console.log(`The skills length is ${skills.length}`);
        const finalFormData = transformData(data);
        console.log(finalFormData);

        // try {
        //     let response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, JSON.stringify(formData));
        //     console.log(response.data);
        // } catch (error) {
        //     console.error(error);
        //     setError("api", {
        //         type: "manual",
        //         message: "There was an error during signup. Please try again.",
        //     });
        // }
        let r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(finalFormData),
            credentials: "include",
        })
        console.log(await r.json());
        // console.log("All Cookies:", document.cookie);
        console.log("Signed up successfully");
        navigate("/");
        // const jwtToken = Cookies.get('jwt_token');
        // console.log("JWT Token:", jwtToken);
        // console.log("All Cookies:", document.cookie);

        // console.log("Submitted", typeof finalFormData);
        // console.log(import.meta.env.VITE_BACKEND_URL);

    };

    return (
        <>
            {isSubmitting && <div>Loading...</div>}
            <Card className="w-full max-w-2xl mx-auto mt-10">
                <CardHeader>
                    <div className="flex flex-col items-start">
                        <Button
                            variant="ghost"
                            onClick={handleGoBack}
                            className="flex items-center text-primary hover:text-primary-dark"
                        >
                            <ArrowLeftIcon size={20} className="mr-2" />
                            Go Back
                        </Button>
                        <CardTitle className="text-4xl font-bold mx-auto my-4">Create a new account</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Enrollment Number Field */}
                            <div className="space-y-2">
                                <Label htmlFor="enrollmentNumber">Enrollment Number</Label>
                                <Input id="enrollmentNumber" placeholder="Enter enrollment number" required
                                    {...register("enrollmentNumber",
                                        {
                                            required: { value: true, message: "Enrollment is required" },
                                            minLength: { value: 11, message: "Enrollment must be of 11 characters" }
                                        })}
                                />
                                {errors.enrollmentNumber?.message && (
                                    <span className="text-red-500 text-sm flex flex-row gap-1 items-center">
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" className="bi bi-exclamation-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                                        </svg> */}
                                        {String(errors.enrollmentNumber.message)}
                                    </span>
                                )}
                            </div>

                            {/* Username Field */}
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
                                    <span className="text-red-500 text-sm">
                                        {String(errors.username.message)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* More Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        className="w-full pr-10"
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
                                    <p className="text-red-500 text-sm mt-1">
                                        {String(errors.password.message)}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Enter your email" required
                                    {...register("email", {
                                        required: { value: true, message: "Email is required" },
                                        pattern: {
                                            value: /^[\w-\.]+@scet\.ac\.in$/,
                                            message: "You must use your college mail id",
                                        },
                                    })} />
                                {errors.email?.message && (
                                    <span className="text-red-500 text-sm">
                                        {String(errors.email.message)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" placeholder="Enter your full name" required
                                {...register("fullName", {
                                    required: { value: true, message: "Full name is required" },
                                })} />
                            {errors.fullName?.message && (
                                <span className="text-red-500 text-sm">
                                    {String(errors.fullName.message)}
                                </span>
                            )}
                        </div>

                        {/* Contact Number */}
                        <div className="space-y-2">
                            <Label htmlFor="contact_no">Contact Number</Label>
                            <Input id="contact_no" placeholder="Enter your contact number" required
                                {...register("contact_no", {
                                    required: { value: true, message: "Contact number is required" },
                                })} />
                            {errors.contact_no?.message && (
                                <span className="text-red-500 text-sm">
                                    {String(errors.contact_no.message)}
                                </span>
                            )}
                        </div>

                        {/* Biography */}
                        <div className="space-y-2">
                            <Label htmlFor="biography">Biography</Label>
                            <Textarea id="biography" placeholder="Tell us a bit about yourself" className="min-h-[100px]"
                                {...register("biography", {
                                    required: { value: true, message: "Biography is required" },
                                })} />
                            {errors.biography?.message && (
                                <span className="text-red-500 text-sm">
                                    {String(errors.biography.message)}
                                </span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Skills</Label>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span key={index} className="bg-gray-950/85 text-white text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="ml-2 text-primary-foreground hover:text-red-500">
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
                            {/* Display skill error */}
                            {errors.skills?.message && (
                                <span className="text-red-500 text-sm">
                                    {String(errors.skills.message)}
                                </span>
                            )}
                        </div>


                        {/* Portfolio */}
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

                        {/* Social Links */}
                        <div className="space-y-2">
                            <Label>Social Links (Optional)</Label>
                            <div className='flex flex-col md:flex-row w-full justify-between'>
                                <div className='flex flex-col w-[45%]'>
                                    <Input id="linkedin" placeholder="LinkedIn URL" {
                                        ...register("linkedin", {
                                            pattern: {
                                                value: /^(https?:\/\/)?(www\.)?linkedin.com\/in\/[a-zA-Z0-9-]+\/?$/,
                                                message: "Enter a valid LinkedIn URL",
                                            },
                                        })
                                    } />
                                    {errors.linkedin?.message && (
                                        <span className="text-red-500 text-sm">
                                            {String(errors.linkedin.message)}
                                        </span>
                                    )}
                                </div>
                                <div className='flex flex-col  w-[45%]'>
                                    <Input id="github" placeholder="GitHub URL" {
                                        ...register("github", {
                                            pattern: {
                                                value: /^(https?:\/\/)?(www\.)?github.com\/[a-zA-Z0-9-]+\/?$/,
                                                message: "Enter a valid GitHub URL",
                                            },
                                        })
                                    } />
                                    {errors.github?.message && (
                                        <span className="text-red-500 text-sm">
                                            {String(errors.github.message)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
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
                        <p>Already have an account? <Link to="/user/login" className='font-semibold'>Log in</Link></p>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default SignupForm