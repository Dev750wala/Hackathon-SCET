// import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const AdminAuth = () => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm<{ password: string }>();

    const onsubmit = async (data: { password: string }) => {
        // console.log(`data to be submitted: ${data}`)

        const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data)
        })
        if (r.ok) {
            console.log("logged in successfully");
        } else if (r.status === 401) {
            setError("password", {
                type: "manual",
                message: "Unauthorized"
            })
            console.log("Unauthorized");
        } else {
            console.log("Some error occurred");
            setError("root", {
                type: "manual",
                message: "Some error occurred"
            })
        }

    }

    return (
        <div className='w-full h-full flex flex-row justify-center items-center p-4 mt-20'>
            <div className='p-10 rounded-xl border-2'>
                <form onSubmit={handleSubmit(onsubmit)} >
                    <div className='flex flex-col justify-center gap-3'>

                        <Label htmlFor="password" className='text-lg'>Admin Password</Label>
                        <Input
                            id="password"
                            type="text"
                            placeholder="Enter admin password"
                            {...register("password", { required: "Admin password required" })}
                        />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminAuth