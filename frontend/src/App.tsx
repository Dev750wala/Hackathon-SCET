import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import SignUpForm from './components/SignUpForm';
import EmailVerificationPage from './components/emailVerificationPage';
import LoginPage from './components/LoginForm';
// import Temp from './components/Temp';

function App() {
    const location = useLocation();

    return (
        <>

            <Routes location={location} key={location.pathname}>
                <Route index element={<Navbar />} />
                <Route path='/user/login' element={<LoginPage />} />
                <Route path='/user/signup' element={<SignUpForm />} />
                <Route path='/user/verifyEmail/:username/:verificationCode' element={<EmailVerificationPage />}/>
            </Routes>

        </>
    );
}

export default App;
