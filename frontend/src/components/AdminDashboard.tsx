// import React from 'react'
import Navbar from './Navbar'

const AdminDashboard = () => {
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