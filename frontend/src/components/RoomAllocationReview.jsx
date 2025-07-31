import { useState, useRef, useEffect, useMemo } from 'react';
import ManageSeats from './ManageSeats';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { ThreeCircles } from 'react-loader-spinner'


const url = '/room-allocation-review';

export default function RoomAllocationReview() {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [details, setDetails] = useState([]);
  const [dates, setDates] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [bookedRooms, setBookedRooms] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortTerm, setSortTerm] = useState("");
  const dateRef = useRef();
  const examRef = useRef();
  const [seatSelected, setSeatSelected] = useState(0);
  let totalCapacity = rooms.reduce((total, obj) => total + obj.capacity, 0);

  const filteredRooms = useMemo(() => {
    let list = rooms;
    if (list.length > 0 && searchTerm) {
      list = list.filter((item) => item.room_no.slice(0, searchTerm.length) === searchTerm.toUpperCase());
    }
    if (list.length > 0 && sortTerm) {
      if (sortTerm === "min") list = list.sort((a, b) => { return a.capacity - b.capacity });
      if (sortTerm === "max") list = list.sort((a, b) => { return b.capacity - a.capacity });
      if (sortTerm === "asc") list = list.sort((a, b) => { return a.room_no.slice(-3) - b.room_no.slice(-3) });
      if (sortTerm === "desc") list = list.sort((a, b) => { return b.room_no.slice(-3) - a.room_no.slice(-3) });
    }
    return list;
  }, [searchTerm, sortTerm, rooms]);

  const handleExcels = async () => {
    setLoading(true);
    try {
      await axiosPrivate.get(url.concat('/send-excels'), {
        withCredentials: true
      });
      setLoading(false);
      alert("Email sent successfully");
    }
    catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const handleRooms = async () => {
    console.log("handle rooms", selectedRooms);
    setLoading(true);
    const controller = new AbortController();

    const date = dateRef.current.options[dateRef.current.selectedIndex].value;
    
    const payload = {
      date,
      
      rooms: rooms.reduce((acc, { room_no, capacity }) => {
        if (selectedRooms.includes(room_no)) {
          acc.push({  room: room_no, capacity });
        }
        return acc;
      }, []),
      details
    };
    
    try {
      await axiosPrivate.post(url.concat("/allocation"), payload, {
        signal: controller.signal
      });
      setLoading(false);
      alert("Arrangement successful for exams on " + date );
      window.location.reload();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    return () => {
      controller.abort();
    }
  }

  const handleExams = () => {
    setLoading(true);
    let isMounted = true;
    const controller = new AbortController();

    const date = dateRef.current.options[dateRef.current.selectedIndex].value;

    const examInfo = { date };

    const getExams = async () => {
      try {
        const response = await axiosPrivate.get(url.concat('/get-exams'), {
          params: examInfo,
          signal: controller.signal
        });
        const { exams, details, totalStudents } = response.data;
        if (isMounted) {
          setExams(exams);
          setDetails(details);
          setStudentsCount(totalStudents);
        }

        const bookedRoomsResponse = await axiosPrivate.get(url.concat('/get-allocation'), {
          params: { date },
          signal: controller.signal
        });
        console.log(bookedRoomsResponse.data);
        if (isMounted) {
          setBookedRooms(bookedRoomsResponse.data.rooms);
          setSelectedRooms([]);
          setSeatSelected(bookedRoomsResponse.data.seats);
          
        }
        setLoading(false);
      }

      catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    getExams();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getRooms = async () => {
      try {
        const response = await axiosPrivate.get(url.concat('/get-rooms'), {
          signal: controller.signal
        });
        isMounted && setRooms(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
    console.log("get rooms");
    getRooms();
    
    const getDates = async () => {
      try {
        const dateResponse = await axiosPrivate.get(url.concat("/dates"), {
          signal: controller.signal
        });
        isMounted && setDates(dateResponse.data);
        const init_date = dateResponse.data[0];

        const examsResponse = await axiosPrivate.get(url.concat('/get-exams'), {
          params: { date: init_date },
          signal: controller.signal
        });
        const { exams, details, totalStudents } = examsResponse.data;
        if (isMounted) {
          setExams(exams);
          setDetails(details);
          setStudentsCount(totalStudents);
        }

        const bookedRoomsResponse = await axiosPrivate.get(url.concat('/get-allocation'), {
          params: { date: init_date},
          signal: controller.signal
        });

        if (isMounted) {
          setBookedRooms(bookedRoomsResponse.data.rooms);
          setSelectedRooms([]);
          setSeatSelected(bookedRoomsResponse.data.seats);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    isMounted && getDates();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, []);

  return (
    <div className="bg-[var(--background)] flex flex-col flex-grow md:w-5/6">
      <div className="bg-[var(--background)] px-8 pt-4 flex flex-col st:flex-row justify-between">
        <div className="flex flex-row mt-6 items-center">
          <h2 className="text-xl font-bold"><span className="whitespace-nowrap">SELECT DATE</span></h2>
          <select ref={dateRef} onChange={handleExams} className="h-10 px-3 py-2 ml-5 rounded-[20px] shadow-sm border-gray-300 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-[var(--blue-save)]">
            {dates.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        

        <div className="flex flex-row mt-6 items-center">
          <h2 className="text-xl font-bold"><span className="whitespace-nowrap">EXAMS SCHEDULED</span></h2>
          <select ref={examRef} className="h-10 px-3 py-2 ml-4 rounded-[20px] shadow-sm border-gray-300 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-[var(--blue-save)]">
            console.log(exams);
            {exams.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col m-8 mt-10">
        <h2 className="text-xl font-bold mb-4">SELECT EXAM HALLS</h2>
        <div className="flex flex-row hw:flex-col st:mb-3">
          <div className="flex-grow flex flex-col relative">
            <div className="flex flex-row justify-between items-center bg-gray-100 px-4 py-3 rounded-t-2xl font-regular">
              {/* <div className="flex-grow flex flex-row items-center ">
                <span className="ml-2 text-gray-500 flex-none">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                    <path
                      fillRule="evenodd"
                      d="M8.5 15a6.5 6.5 0 100-13 6.5 6.5 0 000 13zm5.057-1.54l4.442 4.442a1 1 0 11-1.414 1.414l-4.442-4.442a7 7 0 111.414-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span> 
                <input
                  type="text"
                  placeholder="Search by Room No"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 mx-2 my-1 rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--blue-save)] text-gray-600"
                />
              </div> */}
              <div className="flex-grow flex flex-row items-center ">
                <p className="ml-2 whitespace-nowrap">Sort By :</p>
                <select className="w-full p-2 mx-2 my-1 rounded-md shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--blue-save)] text-gray-600"
                  defaultValue="min" onChange={(e) => setSortTerm(e.target.value)}>
                  <option value="min">Increasing capacity</option>
                  <option value="max">Decreasing capacity</option>
                  <option value="asc">Increasing Floor(0 - 2)</option>
                  <option value="desc">Decreasing Floor(2 - 0)</option>
                </select>
              </div>
            </div>
            <div className={`bg-gray-100 h-[21.5rem] overflow-y-auto rounded-b-2xl p-4 w-full ${studentsCount === 0 && "pointer-events-none"}`}>
              
              {loading ? (<ThreeCircles
                height="65"
                width="65"
                color="#23ca85"
                wrapperStyle={{
                  "position": "absolute",
                  "left": "45%",
                  "top": "40%"
                }}
                visible={true}
              />) : (filteredRooms.map(item => <ManageSeats key={item.room_no} room={item.room_no} capacity={item.capacity} setSelectedRooms={setSelectedRooms} setSeatSelected={setSeatSelected} bookedRooms={bookedRooms} />))
              }
            </div>
          </div>
          <div className="border border-black border-opacity-50 h-full min-w-[300px] self-center rounded-lg flex flex-col ml-5 hw:w-full hw:mx-4 hw:mt-2">
            <h1 className="p-6 font-bold text-xl"> STATISTICS </h1>
            <hr className="border-t border-black border-opacity-50 ml-5 mr-7"></hr>
            <ul className="pl-3 hw:pb-5 mt-4 font-regular">
              <li className="p-3">Total Rooms : {rooms.length}</li>
              <li className="p-3">Available Seats : {bookedRooms.length > 0 ? 0 : totalCapacity - seatSelected}</li>
              <li className={`p-3 ${seatSelected < studentsCount && seatSelected !== 0 ? "text-red-600" : ""} ${seatSelected < studentsCount ? "" : "text-green-600"} `}>Rooms Selected : {bookedRooms.length > 0 ? bookedRooms.length : selectedRooms.length}</li>
              <li className={`p-3 ${seatSelected < studentsCount && seatSelected !== 0 ? "text-red-600" : ""} ${seatSelected < studentsCount ? "" : "text-green-600"} `}>Seats Selected : {seatSelected} </li>
              <li className="p-3">Total Participants : {studentsCount}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="px-8 py-4 my-2">
        <div className="flex flex-row justify-between items-center">
          <div>
          </div>
          <div className="flex flex-row gap-10">
            <button className="bg-[var(--blue-medium)] hover:bg-[var(--blue-light)] text-white font-bold h-10 w-[10rem] rounded-[20px]" type="button" onClick={handleRooms}>ARRANGE</button>
            <button className="bg-[var(--blue-medium)] hover:bg-[var(--blue-light)] text-white font-bold h-10 w-[10rem] rounded-[20px]" type="button" onClick={handleExcels}>RECEIVE MAIL</button>
          </div>
        </div>
      </div>
    </div >
  );
}
