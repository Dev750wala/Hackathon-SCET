import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
// import { SignupForm } from './components/SignUpForm';
import Navbar from './components/Navbar';
import SignUpForm from './components/SignUpForm';

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Navbar />
        },
        {
            path: "/user/login",
            element: <SignUpForm/>
        }
    ])

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
