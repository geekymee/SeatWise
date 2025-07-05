import { useState } from 'react';
import logo from '../assets/logo.png'
import exam from '../assets/exam.png';
import addroom from '../assets/addRoom.png';
import calendar from '../assets/calendar.png';
import allocate from '../assets/allocate.png';
import "../app.css"

function Home() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));
    const isReqWidth = (windowWidth <= 1000);
    return (
        <div className="flex flex-col bg-[var(--background)] flex-grow md:w-5/6">

            <div className="flex-auto flex">
                <div className="bg-[var(--blue-save)] flex-1 flex items-center px-16 py-7 drop-shadow-lg rounded-br-3xl">
                    <p className="font-bold text-5xl text-white tracking-wide leading-snug drop-shadow-lg">Smart Seating, Seamless Exams.</p>
                </div>
                <div className={`bg-[var(--background)] flex-none flex items-center py-3 ${isReqWidth ? "px-3" : "px-16"}`}>
                    <img src={exam} className={`${isReqWidth ? "h-0" : "h-36"}`} alt="students attempting exam" />
                </div>
            </div>

            <div className="bg-[var(--background)] p-14 pl-16">
                <p className="font-medium text-xl">Efficiently organizing exam seating for a smooth and stress-free test day</p>
            </div>

            <div className={`bg-[var(--background)] pt-14 pb-24 ${isReqWidth ? "px-14" : " px-36"}`}>
                <div className={`flex ${isReqWidth ? "flex-row gap-10" : "flex-col"}`}>
                    <div className={`flex-none flex ${isReqWidth ? "flex-col gap-7" : "flex-row px-24"} justify-between`}>
                        <img src={addroom} className="h-16" alt="Manage Rooms" />
                        <img src={calendar} className="h-16" alt="Exam Schedule" />
                        <img src={allocate} className="h-16" alt="Room Allocation Overview" />
                    </div>
                    <div className={`flex ${isReqWidth ? "flex-col py-5" : "flex-row py-1 px-28 "}`}>
                        <div className="h-3 w-3 transform rotate-45 border-2 border-[var(--blue-dark)]">
                            <div className="w-2 h-2 rounded-full bg-[var(--blue-dark)]"></div>
                        </div>
                        <div className={`${isReqWidth ? "mx-[5px] h-full w-0 border-r" : "my-[5px] w-full h-0 border-t"} border-dashed border-[var(--blue-dark)]`}></div>
                        <div className="h-3 w-3 transform rotate-45 border-2 border-[var(--blue-dark)]">
                            <div className="w-2 h-2 rounded-full bg-[var(--blue-dark)]"></div>
                        </div>
                        <div className={`${isReqWidth ? "mx-[5px] h-full w-0 border-r" : "my-[5px] w-full h-0 border-t"} border-dashed border-[var(--blue-dark)]`}></div>
                        <div className="h-3 w-3 transform rotate-45 border-2 border-[var(--blue-dark)]">
                            <div className="w-2 h-2 rounded-full bg-[var(--blue-dark)]"></div>
                        </div>
                    </div>
                    <div className={`flex ${isReqWidth ? "flex-col gap-5" : "flex-row gap-10"} justify-between  font-light`}>
                        <p>Add or remove exam halls and update the number of available seats on the <b>Manage Rooms</b> page.</p>
                        <p>View or update upcoming exam details on the <b>Exam Schedule</b> page. </p>
                        <p>Download Excel reports containing exam hall and participant details from the <b>Room Allocation Overview</b> page.</p>
                    </div>
                </div>
            </div>

            <div className="p-3 flex flex-row justify-between items-center">
                <img src={logo} className="h-5 opacity-50" alt="logo" />
                <div className="flex flex-row gap-5 pr-2 font-light text-[var(--blue-dark)]">
                    <p className="hover:underline cursor-pointer">About</p>
                    <p className="hover:underline cursor-pointer ">Contact</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
