import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useNavigate } from "react-router-dom"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

export function AlertDestructive() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate("/admin/auth");
    };

    return (
        <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md z-50" onScroll={(e) => e.preventDefault()}>
            <Alert variant="destructive" className="w-fit h-fit bg-red-200 p-4 shadow-lg rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Please &nbsp;
                    <button
                        onClick={handleLogout}
                        className="bg-transparent border-none font-semibold underline underline-offset-1 ml-1 text-red-800"
                    >
                        log in
                    </button> &nbsp;
                    to continue with admin!
                </AlertDescription>
            </Alert>
        </div>
    );
}

