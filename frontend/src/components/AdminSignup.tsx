import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ChevronLeft } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AdminSignupDetails {
    username: string
    email: string
    password: string
    fullName: string
    contact_no: string
    skills: string[]
    biography: string
    socialLinks?: {
        linkedin?: string
        github?: string
    }
}

export default function AdminSignup() {
    const { control, handleSubmit, formState: { errors } } = useForm<AdminSignupDetails>()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const onSubmit = async (data: AdminSignupDetails) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            if (!response.ok) {
                throw new Error('Signup failed')
            }
            setSuccess(true)
        } catch (error) {
            console.error('Error during signup:', error)
            setError('An error occurred during signup. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-HOFOkoFpmQ9TjT78ZUMasE2llZYSm8.png')" }}>
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <Alert>
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>
                                Your account has been created successfully. You can now log in.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-HOFOkoFpmQ9TjT78ZUMasE2llZYSm8.png')" }}>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <Button variant="ghost" className="mb-2">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
                    </Button>
                    <CardTitle className="text-2xl font-bold">Create a new account</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Controller
                                name="username"
                                control={control}
                                rules={{ required: 'Username is required' }}
                                render={({ field }) => <Input id="username" placeholder="Choose a username" {...field} />}
                            />
                            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } }}
                                render={({ field }) => <Input id="email" type="email" placeholder="Enter your email" {...field} />}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Controller
                                name="password"
                                control={control}
                                rules={{ required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } }}
                                render={({ field }) => <Input id="password" type="password" placeholder="Enter password" {...field} />}
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Controller
                                name="fullName"
                                control={control}
                                rules={{ required: 'Full name is required' }}
                                render={({ field }) => <Input id="fullName" placeholder="Enter your full name" {...field} />}
                            />
                            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contact_no">Contact Number</Label>
                            <Controller
                                name="contact_no"
                                control={control}
                                rules={{ required: 'Contact number is required' }}
                                render={({ field }) => <Input id="contact_no" placeholder="Enter your contact number" {...field} />}
                            />
                            {errors.contact_no && <p className="text-sm text-red-500">{errors.contact_no.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="skills">Skills (comma-separated)</Label>
                            <Controller
                                name="skills"
                                control={control}
                                rules={{ required: 'At least one skill is required' }}
                                render={({ field }) => <Input id="skills" placeholder="Enter your skills" {...field} onChange={(e) => field.onChange(e.target.value.split(',').map(skill => skill.trim()))} />}
                            />
                            {errors.skills && <p className="text-sm text-red-500">{errors.skills.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="biography">Biography</Label>
                            <Controller
                                name="biography"
                                control={control}
                                rules={{ required: 'Biography is required' }}
                                render={({ field }) => <Textarea id="biography" placeholder="Tell us a bit about yourself" {...field} />}
                            />
                            {errors.biography && <p className="text-sm text-red-500">{errors.biography.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn (optional)</Label>
                            <Controller
                                name="socialLinks.linkedin"
                                control={control}
                                render={({ field }) => <Input id="linkedin" placeholder="Your LinkedIn profile URL" {...field} />}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="github">GitHub (optional)</Label>
                            <Controller
                                name="socialLinks.github"
                                control={control}
                                render={({ field }) => <Input id="github" placeholder="Your GitHub profile URL" {...field} />}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Signing up...' : 'Sign Up'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}