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

function App() {
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = document.cookie.split('; ').find(row => row.startsWith('jwt_token='));

        // TODO create a route to verify the user token. the token should be sent to the backend
        // bacause the token may be tempered with by the user. 
        console.log(token);
        
    }, [dispatch])



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
                    <Route path='/admin/dl' element={<AdminDashboard />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
