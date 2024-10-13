import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowLeftIcon, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { setUser } from '@/redux-store/slices/userInfoSlice'
import { User } from '@/interfaces'

type FormData = {
    enrollmentNumberOrEmail: string
    password: string
}

// interface SocialLinks {
//     linkedin?: string;
//     github?: string;
// }

// interface ParticipationHistory {
//     eventName: string;
//     date: string;
//     awards: string[];
// }

// interface VerificationCode {
//     code: string;
//     createdAt: number;
// }

// interface okReponseData {
//     enrollmentNumber?: string;
//     username: string;
//     password: string;
//     email: string;
//     role: 'student' | 'organizer';
//     fullName: string;
//     profile_pic?: string;
//     contact_no?: string;
//     skills?: string[];
//     biography?: string;
//     portfolio?: string;
//     socialLinks?: SocialLinks;
//     participationHistory?: ParticipationHistory[];
//     availability?: boolean;
//     registrationDate?: Date;
//     verified: boolean;
//     verificationCode: VerificationCode;
// }

interface errorResponseData {
    error: {
        enrollmentNumber: string;
        username: string;
        email: string;
        password: string;
        general: string;
        statusCode: number;
    }
}

// cosnt analyseResponse = (resJson: okReponseData | errorResponseData) => {

// }

export default function LoginPage() {
    const navigate = useNavigate()

    const dispatch = useAppDispatch();
    const userInfo = useAppSelector(state => state.userInfo);

    // if (userInfo !== null) {
    //     return (

    //     )
    // }

    const handleGoBack = () => {
        navigate(-1)
    }
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        },
        setError
    } = useForm<FormData>()
    const [showPassword, setShowPassword] = useState(false)

    const onSubmit = async (data: FormData) => {
        const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include"
        })
        const resJson = await r.json();
        if (r.status === 403) {
            console.log("user already logged in");
        } else if (resJson.error === undefined) {
            // console.log("logged in successfully");
            dispatch(setUser(resJson as User));
            navigate("/");
        } else {
            const errorResponse = resJson as errorResponseData;

            if (errorResponse.error.email !== "") {
                setError("enrollmentNumberOrEmail", {
                    type: "manual",
                    message: errorResponse.error.email
                })
            } else if (errorResponse.error.enrollmentNumber !== "") {
                setError("enrollmentNumberOrEmail", {
                    type: "manual",
                    message: errorResponse.error.enrollmentNumber
                })
            } else if (errorResponse.error.password !== "") {
                setError("password", {
                    type: "manual",
                    message: errorResponse.error.password
                })
            } else if (errorResponse.error.general !== "") {
                setError('root', {
                    type: "manual",
                    message: errorResponse.error.general
                })
            }
            console.log(errorResponse.error);
        }
    }
    if (userInfo !== null) {
        return (
            <div className='w-full h-screen flex justify-center py-[30vh]'>
                <h1 className='text-3xl text-black font-semibold underline underline-offset-3'>You are already logged in</h1>
            </div>
        )
    } else {
        return (
            <div className="min-h-screen flex items-center justify-center  p-4">
                <Card className="w-full max-w-md">
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
                            <CardTitle className="text-3xl font-bold mx-auto my-4">Login to your account</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="enrollmentNumberOrEmail">Enrollment Number / Email</Label>
                                <Input
                                    id="enrollmentNumberOrEmail"
                                    type="text"
                                    placeholder="Enter enrollment number or email"
                                    {...register("enrollmentNumberOrEmail", { required: "Please enter your enrollment number / email" })}
                                />
                                {errors.enrollmentNumberOrEmail && <p className="text-sm text-red-500">{errors.enrollmentNumberOrEmail.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        {...register("password", { required: "Password is required" })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Logging in..." : "Login"}
                            </Button>
                            {
                                errors.root && <div className="text-red-500 text-sm text-center">{errors.root.message}</div>
                            }
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/user/signup" className="text-gray-900 hover:underline font-semibold">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div >
        )
    }
}