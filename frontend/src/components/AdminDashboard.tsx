// import React from 'react'
import Navbar from './Navbar'
import { useAppSelector } from '../redux-store/hooks'
import { removeUser } from '../redux-store/slices/userInfoSlice'
import { useAppDispatch } from '../redux-store/hooks'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const AdminDashboard = () => {

    const adminAuth = useAppSelector(state => state.admin);
    console.log(adminAuth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [error1, setError] = useState<string>("");

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
            <Navbar />
            <div className="flex justify-center items-center h-3/4">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
        </div>
    )
}

export default AdminDashboard