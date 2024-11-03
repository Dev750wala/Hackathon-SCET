// import React from 'react'
import Navbar from './Navbar'
import { useAppSelector } from '../redux-store/hooks'
import { removeUser } from '../redux-store/slices/userInfoSlice'
import { useAppDispatch } from '../redux-store/hooks'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { RainbowButton } from "@/components/ui/rainbow-button";
import { PlusIcon } from 'lucide-react'


const AdminDashboard = () => {

    const adminAuth = useAppSelector(state => state.admin);
    const user = useAppSelector(state => state.userInfo);
    console.log(adminAuth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [error1, setError] = useState<string>("");
    console.log(user);

    useEffect(() => {
        setTimeout(() => {
            console.log("Hedjsifhsdo");
            
        }, 1500);
    }, [])

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
                navigate("/admin/auth")
            }
        } catch (error) {
            console.log(error);
            setError("There was an error in logging out");
        }
    }

    const handleCreateProject = () => {
        navigate("/admin/create-project");
    }

    if (!adminAuth) {
        return (
            <div className="w-full h-screen">
                <div className="w-full h-3/4 flex flex-col justify-center items-center px-4 sm:px-10 py-20 sm:py-[30vh] ">
                    <h1 className="text-2xl font-bold">You are not authorized to view this page</h1>
                    <h3 className="text-base sm:text-lg text-center">
                        Please         &nbsp;
                        <button onClick={() => handleLogout()} className="bg-transparent border-none font-semibold underline underline-offset-1 ml-1">
                            log out
                        </button> &nbsp;
                        to continue with admin!
                    </h3>
                    {error1 && <p className="text-red-500">{error1}</p>}
                </div>
            </div>
        )
    }
    return (
        <div className="w-full h-screen">
            <Navbar userType='organizer' />
            <div className="flex flex-col justify-center gap-7 w-full h-3/4 items-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-black font-bold text-wrap px-4 my-5">
                    Welcome Back, {user ? ` ${user.fullName.split(" ")[0]}` : ''}!
                </h1>
                {
                    user ?
                        <RainbowButton className='gap-1 flex items-center justify-center' onClick={() => handleCreateProject()}>
                            <PlusIcon className="w-6 h-6" />
                            Create a new Project
                        </RainbowButton>
                        :
                        <>
                            <h1 className='text-red-800'>You are logged in as previleged user</h1>
                        </>
                }
            </div>
        </div>
    )
}

export default AdminDashboard