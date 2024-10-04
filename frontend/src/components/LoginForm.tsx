import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowLeftIcon, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type FormData = {
    enrollmentOrEmail: string
    password: string
}

export default function LoginPage() {
    const navigate = useNavigate()

    const handleGoBack = () => {
        navigate(-1)
    }
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm<FormData>()
    const [showPassword, setShowPassword] = useState(false)

    const onSubmit = async (data: FormData) => {
        const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        const res = await r.text();
        console.log(res);
        
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
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
                            <Label htmlFor="enrollmentOrEmail">Enrollment Number / Email</Label>
                            <Input
                                id="enrollmentOrEmail"
                                type="text"
                                placeholder="Enter enrollment number or email"
                                {...register("enrollmentOrEmail", { required: "Please enter your enrollment number / email" })}
                            />
                            {errors.enrollmentOrEmail && <p className="text-sm text-red-500">{errors.enrollmentOrEmail.message}</p>}
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