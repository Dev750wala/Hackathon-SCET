import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import { removeAdmin, setAdmin } from './redux-store/slices/adminSlice';
import { verificationUser } from './interfaces';
import AdminLogin from './components/AdminLogin';
import ProjectCreationForm from './components/ProjectCreationForm';
import { AlertDestructive } from './components/AlertBox';
import UserProfile from './components/UserProfile';
import ProjectDetail from './components/ProjectDetail';
import AdvancedSearch from './components/SearchPage';


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
                    } else if (resJson.user === null) {
                        dispatch(removeUser());
                        console.log("STORE: user removed");
                    }
                    if (resJson.isAdmin) {
                        dispatch(setAdmin());
                        console.log("STORE: admin set");
                    } else if (resJson.isAdmin === null) {
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

        // TODO: Implement the following code in the future
        // ----------------- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -----------------
        // const disableRightClick = (e: any) => {
        //     e.preventDefault();
        // };
        // document.addEventListener('contextmenu', disableRightClick);

        // const disableDevToolsShortcuts = (e: any) => {
        //     // F12
        //     if (e.key === 'F12') {
        //         e.preventDefault();
        //     }

        //     // Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J (DevTools)
        //     if ((e.ctrlKey && e.shiftKey && e.key === 'I') ||
        //         (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        //         (e.ctrlKey && e.shiftKey && e.key === 'J')) {
        //         e.preventDefault();
        //     }

        //     // Ctrl+U (View Page Source)
        //     if (e.ctrlKey && e.key === 'U') {
        //         e.preventDefault();
        //     }

        //     // Ctrl+S (Save As)
        //     if (e.ctrlKey && e.key === 'S') {
        //         e.preventDefault();
        //     }

        //     // Ctrl+Shift+K (Console)
        //     if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        //         e.preventDefault();
        //     }
        // };
        // document.addEventListener('keydown', disableDevToolsShortcuts);

        // return () => {
        //     document.removeEventListener('contextmenu', disableRightClick);
        //     document.removeEventListener('keydown', disableDevToolsShortcuts);
        // };
        // ----------------- xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ----------------
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
                    <Route path='/:username' element={<UserProfile />} />
                    <Route path='/projects/:projectId' element={<ProjectDetail />} />
                    <Route path='/search' element={<AdvancedSearch />} />
                    <Route path='/demo' element={<AlertDestructive />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
