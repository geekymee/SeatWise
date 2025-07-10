import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useState } from 'react';
import menu from '../assets/menu.png';
import menucollapse from '../assets/menucollapse.png';
import home from '../assets/home.png';
import room from '../assets/addroom.png';
import exam from '../assets/exam.png';
import seat from '../assets/allocate.png';
import logout from '../assets/logout.png';
import profile from '../assets/profile.png';
const url = '/logout';

export default function NavBar() {
    const axiosPrivate = useAxiosPrivate();
    const { auth, setAuth } = useAuth();
    const [expand, setExpand] = useState(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    window.addEventListener("resize", () => handleWidth());
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

    const handleWidth = () => {
        if (windowWidth < 996) {
            setExpand(false);
        } else {
            setExpand(true);
        }
    }

    const handleExpand = () => {
        setExpand(!expand);
    }

    const handleLogout = async () => {
        try {
            await axiosPrivate.get(url, {
                withCredentials: true
            });
            auth.accessToken = "";
            setAuth(auth);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={`whitespace-nowrap flex flex-col min-h-screen bg-[var(--blue-medium)] ${expand ? "w-64" : "w-14 flex-none"}`}>
            <div className="flex flex-col h-48 ml-2 select-none">
                <img src={expand ? menucollapse : menu} alt="menu" className={`h-8 w-8 self-end cursor-pointer p-1 m-3`} onClick={handleExpand} title={`${expand ? "Collapse Navbar" : "Expand Navbar"}`} />
                <div className="flex flex-row ">
                    <img src={profile} alt="profile photo" className={`${expand ? "rounded-full w-8 h-8 m-4 self-center" : "rounded-full w-8 h-8 ml-1 mr-4 my-1 self-center"}`} />
                    <p className={`${expand ? "mr-7 text-white font-medium tracking-needed self-center uppercase truncate ... " : " absolute left-[-999px]"}`}>{auth.user}</p>
                </div>
                <hr className="border-t border-[var(--blue-light)] ml-5 mr-7"></hr>
            </div>

            <div className="flex flex-col h-full py-5">
                <NavLink to="home" className={({ isActive }) => isActive ? "bg-[var(--blue-dark)] py-2 w-full flex flex-row" : "hover:bg-[var(--blue-light)] py-2 w-full flex flex-row"}>
                    <p className={`font-medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>Home</p>
                    <img src={home} alt="Home" className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 ml-3 mr-4 my-1"}`} title="home" />
                </NavLink>

                <NavLink to="manage-room" className={({ isActive }) => isActive ? " bg-[var(--blue-dark)] py-2 w-full flex flex-row" : "hover:bg-[var(--blue-light)] py-2 w-full flex flex-row"}>
                    <p className={`font-medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>Manage Rooms</p>
                    <img src={room} alt="room" className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 ml-[14px] mr-4 my-1"}`} title="Manage Rooms" />
                </NavLink>

                <NavLink to="exam-schedule" className={({ isActive }) => isActive ? " bg-[var(--blue-dark)] py-2 w-full flex flex-row" : "hover:bg-[var(--blue-light)] py-2 w-full flex flex-row"}>
                    <p className={`font-medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>Exam schedule</p>
                    <img src={exam}  className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 ml-[14px] mr-4 my-1"}`} title="Exam schedule" />
                </NavLink>

                <NavLink to="room-allocation-review" className={({ isActive }) => isActive ? " bg-[var(--blue-dark)] py-2 w-full flex flex-row" : "hover:bg-[var(--blue-light)] py-2 w-full flex flex-row"}>
                    <p className={`font-medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>Room Allocation Overview</p>
                    <img src={seat} className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 ml-3 mr-4 my-1"}`} title="Room Allocation Overview" />
                </NavLink>

                <div className="flex-grow"></div> 
                <NavLink to="/" onClick={handleLogout} className="text-center hover:bg-[var(--blue-light)] py-2 w-full">
                    <p className={`font-medium tracking-needed text-white ${expand ? "mx-6" : "absolute left-[-999px]"}`}>Log Out</p>
                    <img src={logout} className={`${expand ? "absolute left-[-999px]" : "h-7 w-7 mx-4"}`} title="Log Out" />
                </NavLink>
            </div>
        </div>
    );
}
