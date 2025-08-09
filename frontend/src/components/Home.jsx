import addroom from '../assets/addRoom.png';
import calendar from '../assets/calendar.png';
import allocate from '../assets/allocate.png';
import useWindowWidth from '../hooks/useWindowWidth';
import "../app.css"

function Home() {
    const windowWidth = useWindowWidth();
    const isReqWidth = (windowWidth <= 1000);
    return (
        <div className="flex flex-col bg-[var(--background)] flex-grow md:w-5/6">
            <div className="flex justify-center items-center bg-[var(--blue-save)] px-8 py-10 drop-shadow-lg rounded-br-4xl">
              <p className="font-bold text-5xl text-white tracking-wide leading-snug text-center drop-shadow-lg">
                One Platform, Every Seat Counted.
              </p>
            </div>
            <div className="bg-[var(--background)] py-10 px-8 text-center">
              <p className="font-medium text-2xl">
                Make exam seating automatic, accurate, and effortless.
              </p>
            </div>

            <div className={`bg-[var(--background)] pt-14 pb-24 ${isReqWidth ? "px-14" : " px-36"}`}>
                <div className={`flex ${isReqWidth ? "flex-row gap-10" : "flex-col"}`}>
                    <div className={`flex-none flex ${isReqWidth ? "flex-col gap-7" : "flex-row px-24"} justify-between `}>
                        <img src={addroom} className="h-16" alt="Manage Rooms" />
                        <img src={calendar} className="h-16" alt="Exam Schedule" />
                        <img src={allocate} className="h-16" alt="Room Allocation Review" />
                    </div>
                    <div className={`flex ${isReqWidth ? "flex-col py-5" : "flex-row py-1 px-28 "}`}>
                        <div className="h-3 w-3 transform rotate-45 border-2 border-[var(--blue-dark)] ">
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
                    <div className={`flex ${isReqWidth ? "flex-col gap-5" : "flex-row gap-10"} justify-between  font-light list-none`}>
                        <p>Add or remove exam halls and update the number of available seats on the <b>Manage Rooms</b> page.</p>
                        <p>View or update upcoming exam details on the <b>Exam Schedule</b> page. </p>
                        <p>Download Excel reports containing exam hall and participant details from the <b>Room Allocation Review</b> page.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;
