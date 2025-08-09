import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
// import { ClipLoader } from "react-loader-spinner";
import { ClipLoader } from "react-spinners";

const KeepLoggedin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setIsLoading(false);
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, []);

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`)
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    }, [isLoading]);

    return (
        <>
            {isLoading ? 
                <div className="h-screen flex items-center justify-center ">
                    <ClipLoader size={65} color="#23ca85" />
                </div> : <Outlet />
            }
        </>
    );
}

export default KeepLoggedin;