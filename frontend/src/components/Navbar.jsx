import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useWindowWidth from '../hooks/useWindowWidth'; // <-- use your custom hook

import menu from '../assets/menu.png';
import menucollapse from '../assets/menuCollapse.png';
import home from '../assets/home.png';
import room from '../assets/addRoomlogo.png';
import exam from '../assets/exam.png';
import seat from '../assets/allocatelogo.png';
import logout from '../assets/logout.png';
import profile from '../assets/profile.png';

const url = '/logout';

export default function NavBar() {
    const axiosPrivate = useAxiosPrivate();
    const { auth, setAuth } = useAuth();
    const width = useWindowWidth();  
    const [expand, setExpand] = useState(width >= 996);

    useEffect(() => {
        setExpand(width >= 996);
    }, [width]);

    const handleExpand = () => setExpand(!expand);

    const handleLogout = async () => {
        try {
            await axiosPrivate.get(url, { withCredentials: true });
            auth.accessToken = "";
            setAuth(auth);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={`whitespace-nowrap flex flex-col min-h-screen bg-[var(--blue-medium)] ${expand ? "w-64" : "w-14 flex-none"}`}>
            <div className="flex flex-col h-48 ml-2 select-none">
                <img src={expand ? menucollapse : menu} alt="menu" className="h-8 w-8 self-end cursor-pointer p-1 m-3" onClick={handleExpand} title={expand ? "Collapse Navbar" : "Expand Navbar"} />
                <div className="flex flex-row">
                    <img src={profile} alt="profile photo" className="rounded-full w-8 h-8 m-1  self-center " />
                    <p className={`${expand ? "m-1 text-white font-medium self-center truncate" : "absolute left-[-996px]"}`}>Welcome,</p>
                    <p className={`${expand ? "mr-7 text-white font-medium self-center uppercase truncate" : "absolute left-[-991px]"}`}>{auth.user}</p>
                </div>
                <hr className="border-t border-[var(--blue-light)] ml-2 mr-7 mt-1" />
            </div>

            <div className="flex flex-col h-full py-5">
                {[
                    { to: "home", label: "Home", icon: home },
                    { to: "manage-room", label: "Manage Rooms", icon: room },
                    { to: "exam-schedule", label: "Exam Schedule", icon: exam },
                    { to: "room-allocation-review", label: "Room Allocation Overview", icon: seat },
                ].map(({ to, label, icon }) => (
                    <NavLink key={to} to={to} className={({ isActive }) => `${isActive ? "bg-[var(--blue-dark)]" : "hover:bg-[var(--blue-light)]"} py-2 w-full flex flex-row`}>
                        <p className={`font-medium text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>{label}</p>
                        <img src={icon} alt={label} className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 ml-3 mr-4 my-1"}`} title={label} />
                    </NavLink>
                ))}
                <div className="flex-grow"></div>
                <NavLink to="/" onClick={handleLogout} className="text-center hover:bg-[var(--blue-light)] py-2 w-full">
                    <p className={`font-medium text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>Log Out</p>
                    <img src={logout} className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 mx-4"}`} title="Log Out" />
                </NavLink>
            </div>
        </div>
    );
}
