import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { faExclamationCircle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import useAuth from "../hooks/useAuth";
import '../app.css';
import backgroundimg from "../assets/backgroundimage.jpg"

const LOGIN_URL = '/login';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location?.state?.from?.pathname || '/home';
    const { setAuth } = useAuth();
    const userRef = useRef();
    const errRef = useRef();
    const [showPwd, setShowPwd] = useState(false);
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [pwdFocus, setPwdFocus] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const toggleShowPwd = () => {
        setShowPwd(!showPwd);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            setAuth({ user, accessToken });
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }


    return (
        <div className="flex flex-row items-center justify-between h-screen bg-no-repeat bg-cover bg-center" 
            style={{ backgroundImage: `url(${backgroundimg})` }}>
            <div>
                <h1>.</h1>
            </div>
            <div className="flex flex-col items-center justify-center h-screen w-[25rem] px-14 shadow-black shadow-md bg-[var(--blue-save)]">
                <div className="flex flex-col items-center justify-center h-screen w-full">
                    <h1 className="text-3xl text-center text-white tracking-wide  mb-10 font-medium">LOG IN</h1>
                    <div className={errMsg ? "flex flex-rows items-center p-2 h-10 w-full border border-red-700 rounded-[10px] bg-red-200 text-red-700  mb-2" : "h-0 w-0 absolute left-[-9999px]"}>
                        <FontAwesomeIcon icon={faExclamationCircle} className="h-4 p-2" />
                        <p ref={errRef} className="font-regular text-sm pl-1" aria-live="assertive">{errMsg}</p>
                    </div>
                    <form className="space-y-6 w-full" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-white tracking-wide font-medium mb-2" htmlFor="username">Username</label>
                            <input
                                className="mt-2 w-full h-12 px-3 py-2 rounded-[10px] shadow-sm focus:outline-none focus:ring focus:ring-white focus:ring-opacity-40"
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                                placeholder="Enter your username"
                                spellCheck="false" />
                        </div>
                        <div>
                            <label className="text-white tracking-wide font-medium mb-2" htmlFor="password">Password</label>
                            <div className={`mt-2 flex flex-row items-center w-full h-12 rounded-[10px] shadow-sm ${pwdFocus ? "ring ring-white ring-opacity-40" : ""}`}>
                                <input
                                    className="h-12 w-full px-3 py-2 rounded-l-[10px] outline-none"
                                    type={showPwd ? 'text' : 'password'}
                                    id="password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    onFocus={() => setPwdFocus(true)}
                                    onBlur={() => setPwdFocus(false)}
                                    value={pwd}
                                    required
                                    placeholder="Enter your password" />
                                <div className="flex bg-[var(--blue-medium)] w-10 h-12 rounded-r-[10px] items-center justify-center">
                                    <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} className="text-white  cursor-pointer border-white" onClick={toggleShowPwd} />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center pt-3 ">
                            <button
                                className="border bg-var(--blue-save) tracking-wider hover:bg-opacity-25  hover:bg-[var(--blue-dark)]  hover:border-[var(--blue-dark)]  text-white font-bold py-3 px-7 rounded-[30px] focus:outline-none focus:shadow-outline select-none"
                                type="submit">
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
                <div className="flex items-center justify-center mb-10 gap-2 select-none">
                    <p>
                        Don't have an account?
                    </p>
                    <span className="block hover:text-black hover:underline">
                        <Link to="/register">Sign Up</Link>
                    </span>
                </div>

            </div>
        </div>
    );
}