import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from './Loader';

const EmailVerificationPage = () => {
    const [verifiedResponse, setVerifiedResponse] = useState<null | number>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const params = useParams<{ username: string, verificationCode: string }>();

    useEffect(() => {
        const verifyEmail = async () => {
            let response;
            try {
                response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/verifyEmail/${params.username}/${params.verificationCode}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (response.ok) {
                    setVerifiedResponse(200);
                } else if (response.status === 400 || response.status === 404) {
                    setVerifiedResponse(response.status);
                    setErrorMessage('Verification failed. Invalid username or code.');
                } else {
                    setVerifiedResponse(response.status);
                    setErrorMessage('An unexpected error occurred. Please try again later.');
                }
            } catch (error) {
                setVerifiedResponse(500);
                setErrorMessage('Network or server error. Please check your connection.');
                console.error('Error fetching verification:', error);
            } finally {
                setLoading(false);
            }
        };
        verifyEmail();
    }, [params.username, params.verificationCode]);

    return (
        <>
            {loading &&
                <>
                    <div className="flex justify-center items-center h-screen">
                        <Loader /></div>
                </>}


            {!loading && verifiedResponse === 200 && (
                <div className='flex flex-col items-center mt-20 h-screen'>
                    <h2 className='text-lg font-semibold text-green-600'>Email Verified Successfully!</h2>
                    <p>You can close this tab now</p>
                </div>
            )}

            {!loading && verifiedResponse !== 200 && errorMessage && (
                <div className='flex flex-col items-center mt-20 h-screen'>
                    <h2 className='text-lg font-semibold text-red-700'>Email Verification Failed!</h2>
                    <p>Make sure you've clicked on correct URL</p>
                </div>
            )}
        </>
    );
};

export default EmailVerificationPage;
