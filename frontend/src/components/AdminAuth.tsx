// import React from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks'
import { removeUser } from '@/redux-store/slices/userInfoSlice'
import { setAdmin } from '@/redux-store/slices/adminSlice'
import { useNavigate } from 'react-router-dom'

const AdminAuth = () => {

    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.userInfo);
    const admin = useAppSelector(state => state.admin);

    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log("logging out");
        try {
            const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            })
            if (r.ok) {
                dispatch(removeUser());
            }
        } catch (error) {
            console.log(error);
        }
    }

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
            dispatch(setAdmin());
            console.log("Admin status set in the store.");
            navigate("/admin/dl");
            console.log(admin);
            
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

    if (user?.role === "organizer") {
        return (
            <div className='w-full h-screen flex justify-center py-[30vh] px-10'>
                <h1 className='text-3xl text-black font-semibold underline underline-offset-3'>You are already logged in as an admin</h1>
            </div>
        )
    } else if (user?.role === "student") {
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center px-4 sm:px-10 py-20 sm:py-[30vh]">
                <h1 className="text-xl sm:text-2xl md:text-3xl text-black font-semibold mb-4 text-center">
                    You are logged in as a normal user
                </h1>
                <h3 className="text-base sm:text-lg text-center">
                    Please         &nbsp;            
                    <button onClick={() => handleLogout()} className="bg-transparent border-none font-semibold underline underline-offset-1 ml-1">
                        log out
                    </button> &nbsp;
                    to continue with admin!
                </h3>
            </div>

        )
    }
    return (
        <div className='w-[100vw] h-[100vh] flex flex-row justify-center items-center p-4 '>
            <div className='p-10 rounded-xl border border-gray-950/45 bg-gray-50'>
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
