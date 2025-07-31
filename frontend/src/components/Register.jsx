import { useRef, useState, useEffect } from "react";
import { faInfoCircle, faExclamationCircle, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { Link, useNavigate } from "react-router-dom";
import '../app.css';
import backgroundimg from "../assets/backgroundimage.jpg";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const MAIL_REGEX = /^[A-Za-z0-9._]+@mnnit\.ac\.in$/;
const REGISTER_URL = '/register';

const Register = () => {
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();
  const emailRef = useRef();

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [mail, setMail] = useState('');
  const [validMail, setValidMail] = useState(false);
  const [mailFocus, setMailFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => emailRef.current.focus(), []);
  useEffect(() => setValidMail(MAIL_REGEX.test(mail)), [mail]);
  useEffect(() => setValidName(USER_REGEX.test(user)), [user]);
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);
  useEffect(() => setErrMsg(''), [user, pwd, matchPwd]);

  const toggleShowPwd = () => setShowPwd(!showPwd);
  const toggleShowConfirmPwd = () => setShowConfirmPwd(!showConfirmPwd);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validName || !validPwd || !validMail || !validMatch) {
      setErrMsg("Invalid Entry");
      return;
    }
    const email = emailRef.current.value;
    try {
      const response = await axios.post(REGISTER_URL, JSON.stringify({ user, email, pwd }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      console.log(response?.data);
      navigate('/');
      setUser('');
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No server response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username already taken');
      } else {
        setErrMsg('Registration failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <div
      className="relative min-h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundimg})` }}
    >
      <div className="absolute inset-0 bg-black/55 z-0" />

      <div className="absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--blue-save)] rounded-xl shadow-xl border border-gray-600 px-8 py-12 max-h-[95vh] overflow-auto">
        <h1 className="text-3xl font-medium text-center text-[var(--blue-dark)] mb-6">REGISTER</h1>

        {errMsg && (
          <div className="flex items-center bg-red-100 text-red-700 border border-red-500 p-2 rounded-md mb-4">
            <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
            <p ref={errRef} className="text-sm" aria-live="assertive">{errMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="text-black tracking-wide font-medium mb-2 block">Username</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              value={user}
              placeholder="Enter your username"
              onChange={(e) => setUser(e.target.value)}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              aria-invalid={!validName}
              className="w-full h-12 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--blue-dark)]"
            />
            {userFocus && user && !validName && (
              <p className="text-sm text-red-600 mt-1 flex items-start gap-1">
                <FontAwesomeIcon icon={faInfoCircle} className="mt-1" />
                <span>
                  4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, and hyphens allowed.
                </span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="text-black tracking-wide font-medium mb-2 block">Email</label>
            <input
              type="text"
              id="email"
              ref={emailRef}
              autoComplete="off"
              value={mail}
              placeholder="Enter your MNNIT email"
              onChange={(e) => setMail(e.target.value)}
              onFocus={() => setMailFocus(true)}
              onBlur={() => setMailFocus(false)}
              aria-invalid={!validMail}
              className="w-full h-12 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[var(--blue-dark)]"
            />
            {mailFocus && mail && !validMail && (
              <p className="text-sm text-red-600 mt-1 flex items-start gap-1">
                <FontAwesomeIcon icon={faInfoCircle} className="mt-1" />
                <span>Email must be your official GSuite ID (e.g. `@mnnit.ac.in`).</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-black tracking-wide font-medium mb-2 block">Password</label>
            <div className="flex w-full h-12 rounded-md border overflow-hidden">
              <input
                type={showPwd ? 'text' : 'password'}
                id="password"
                value={pwd}
                placeholder="Enter your password"
                onChange={(e) => setPwd(e.target.value)}
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                aria-invalid={!validPwd}
                className="w-full px-4 py-2 outline-none"
              />
              <div className="w-12 h-full bg-[var(--blue-medium)] flex items-center justify-center cursor-pointer" onClick={toggleShowPwd}>
                <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} className="text-white h-5" />
              </div>
            </div>
            {pwdFocus && !validPwd && (
              <p className="text-sm text-red-600 mt-1 flex items-start gap-1">
                <FontAwesomeIcon icon={faInfoCircle} className="mt-1" />
                <span>
                  8-24 characters, must include uppercase, lowercase, number, and special character (!@#$%).
                </span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirm_pwd" className="text-black tracking-wide font-medium mb-2 block">Confirm Password</label>
            <div className="flex w-full h-12 rounded-md border overflow-hidden">
              <input
                type={showConfirmPwd ? 'text' : 'password'}
                id="confirm_pwd"
                value={matchPwd}
                placeholder="Re-enter your password"
                onChange={(e) => setMatchPwd(e.target.value)}
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
                aria-invalid={!validMatch}
                className="w-full px-4 py-2 outline-none"
              />
              <div className="w-12 h-full bg-[var(--blue-medium)] flex items-center justify-center cursor-pointer" onClick={toggleShowConfirmPwd}>
                <FontAwesomeIcon icon={showConfirmPwd ? faEyeSlash : faEye} className="text-white h-5" />
              </div>
            </div>
            {matchFocus && !validMatch && (
              <p className="text-sm text-red-600 mt-1 flex items-start gap-1">
                <FontAwesomeIcon icon={faInfoCircle} className="mt-1" />
                <span>Passwords do not match.</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[var(--blue-medium)] hover:bg-[var(--blue-dark)] text-white font-semibold rounded-lg transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center text-sm text-gray-700 mt-6">
          Already have an account?{' '}
          <Link to="/" className="text-[var(--blue-dark)] hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
