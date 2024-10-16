import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
// import Navbar from './components/Navbar';
import SignUpForm from './components/SignUpForm';
import bgImg from "./assets/bg.png"
import EmailVerificationPage from './components/emailVerificationPage';
import LoginPage from './components/LoginForm';
import AdminAuth from './components/AdminAuth';
import Home from './components/Home';
import AdminSignup from './components/AdminSignup';
import AdminDashboard from './components/AdminDashboard';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { removeUser, setUser } from './redux-store/slices/userInfoSlice';
// import { User } from './interfaces';
import { removeAdmin, setAdmin } from './redux-store/slices/adminSlice';
import { verificationUser } from './interfaces';
import AdminLogin from './components/AdminLogin';
import ProjectCreationForm from './components/ProjectCreationForm';
import { AlertDestructive } from './components/AlertBox';


function App() {
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/api/auth/verify`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include"
                });

                const resJson: verificationUser = await response.json();
                console.log(resJson);
                
                if (resJson.user || resJson.isAdmin) {
                    if (resJson.user) {
                        dispatch(setUser(resJson.user));
                        console.log("STORE: user set");
                    } else {
                        dispatch(removeUser());
                        console.log("STORE: user removed");
                    }
                    if (resJson.isAdmin) {
                        dispatch(setAdmin());
                        console.log("STORE: admin set");
                    } else {
                        dispatch(removeAdmin());
                        console.log("STORE: admin removed");
                    }
                } else {
                    dispatch(removeUser());
                    dispatch(removeAdmin());
                    console.log("STORE: user and admin removed");
                }
            } catch (error) {
                dispatch(removeUser());
                dispatch(removeAdmin());
                console.log("Error occurred. User and admin removed from the store.");
            }
        };

        verifyToken();
    }, [dispatch, location]);



    return (
        <>
            <div className='bg-center bg-no-repeat bg-auto' style={{ backgroundImage: `url(${bgImg})` }}>
                <Routes location={location}>
                    <Route index element={<Home />} />
                    <Route path='/user/login' element={<LoginPage />} />
                    <Route path='/user/signup' element={<SignUpForm />} />
                    <Route path='/user/verifyEmail/:username/:verificationCode' element={<EmailVerificationPage />} />
                    <Route path='/admin/auth' element={<AdminAuth />} />
                    <Route path='/admin/signup' element={<AdminSignup />} />
                    <Route path='/admin/login' element={<AdminLogin />} />
                    <Route path='/admin/dl' element={<AdminDashboard />} />
                    <Route path='/admin/create-project' element={<ProjectCreationForm />} />
                    <Route path='/demo' element={<AlertDestructive />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
