import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { faExclamationCircle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import useAuth from "../hooks/useAuth";
import '../app.css';
import backgroundimg from "../assets/backgroundimage.jpg";

const LOGIN_URL = '/auth';

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

    const toggleShowPwd = () => setShowPwd(prev => !prev);

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
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-no-repeat "
            style={{ backgroundImage: `url(${backgroundimg})`}}
        >

            <div className="absolute inset-0 bg-black/55 z-0" />

            <div className="absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--blue-save)] rounded-xl shadow-xl border border-gray-600 px-8 py-12 min-h-[28rem]">

                <h1 className="text-3xl font-medium text-center text-[var(--blue-dark)] mb-6">LOG IN</h1>

                <div className={errMsg ? "flex items-center bg-red-100 text-red-700 border border-red-500 p-2 rounded-md mb-4" : "hidden"}>
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                    <p ref={errRef} className="text-sm" aria-live="assertive">{errMsg}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-[var(--blue-dark)]">Username</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            required
                            placeholder="Enter your username"
                            className="w-full mt-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blue-dark)]"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--blue-dark)]">Password</label>
                        <div className={`flex items-center mt-2 border rounded-md ${pwdFocus ? 'ring-2 ring-[var(--blue-dark)]' : ''}`}>
                            <input
                                type={showPwd ? 'text' : 'password'}
                                id="password"
                                value={pwd}
                                onChange={(e) => setPwd(e.target.value)}
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                                required
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 rounded-l-md focus:outline-none"
                            />
                            <div className="w-12 h-12 flex items-center justify-center bg-[var(--blue-medium)] rounded-r-md cursor-pointer" onClick={toggleShowPwd}>
                                <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} className="text-white h-5" />
                            </div>
                        </div>

                    </div>

                    <button type="submit" className="w-full py-3 bg-[var(--blue-medium)] hover:bg-[var(--blue-dark)] text-white font-semibold rounded-lg transition duration-300">
                        Sign In
                    </button>
                </form>

                <div className="text-center text-sm text-gray-800 mt-4">
                    Don't have an account?
                    <Link to="/register" className="text-[var(--blue-dark)] hover:underline ml-1">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}
