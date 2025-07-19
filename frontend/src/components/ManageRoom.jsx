import Input from './Input';
import Dropdown from './Dropdown';
import { useState, useRef, useEffect, useMemo } from 'react';
import ManageRow from './ManageRow';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import { ThreeCircles } from 'react-loader-spinner'

const url = '/manage-room';

export default function ManageRoom() {
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTerm, setFilterTerm] = useState("");
    const [sortTerm, setSortTerm] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const formRef = useRef();
    const roomNoRef = useRef();
    const floorNoRef = useRef();
    const buildingRef = useRef();
    const capacityRef = useRef();
    const navigate = useNavigate();

    const filteredRows = useMemo(() => {
        let list = rows;
        if (list.length > 0 && searchTerm) {
            list = list.filter(
                (item) =>
                    item.room_no.slice(0, searchTerm.length).toUpperCase() === searchTerm.toUpperCase()
            );
        }
      
        if (list.length > 0 && filterTerm) {
            if (['Main building', 'SMS building', 'CC building'].includes(filterTerm)) {
                list = list.filter((item) => item.building === filterTerm);
            } else if (filterTerm !== 'nil') {
                list = list.filter((item) => item.floor_no.toString() === filterTerm);
            }
        }
        return list;
    }, [searchTerm, filterTerm, rows]);

    const sortedRows = useMemo(() => {
        let list = [...filteredRows];
        if (list.length > 0 && sortTerm) {
            if (sortTerm === 'asc') {
                list = list.sort((a, b) => a.floor_no - b.floor_no);
            } else if (sortTerm === 'desc') {
                list = list.sort((a, b) => b.floor_no - a.floor_no);
            }
        }
        return list;
    }, [sortTerm, filteredRows]);

    const list = sortTerm && !['asc', 'desc'].includes(sortTerm) ? filteredRows : sortedRows;
    const totalCapacity = list.reduce((total, obj) => total + obj.capacity, 0);


    const handleRoom = (e) => {
        e.preventDefault();
        setLoading(true);
        const newRoom = { 
            room_no:  roomNoRef.current.value, 
            floor_no: parseInt(floorNoRef.current.options[floorNoRef.current.selectedIndex].value, 10), 
            building: buildingRef.current.options[buildingRef.current.selectedIndex].value, 
            capacity: parseInt(capacityRef.current.value, 10) 
        };
        console.log('POST payload:', newRoom);
        let isMounted = true;
        console.log(isMounted);
        const controller = new AbortController();

        const postRooms = async () => {
            setLoading(true);
            
            try {
                await axiosPrivate.post(url, newRoom, {
                    signal: controller.signal
                });
                isMounted && setRows(prev => [...prev, newRoom]);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        postRooms();

        formRef.current.reset();
        roomNoRef.current.focus();

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
                const response = await axiosPrivate.get(url, {
                    signal: controller.signal
                });
                isMounted && setRows(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }

        getRooms();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [axiosPrivate]);

    const handleDelete = (roomNo) => {
        setLoading(true);
        let isMounted = true;
        const controller = new AbortController();

        const deleteRoom = async () => {
            try {
                await axiosPrivate.delete(url.concat(`/${roomNo}`), {
                    signal: controller.signal
                });
                isMounted && setRows(prev => prev.filter(item => item.room_no !== roomNo));
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        deleteRoom();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    const handleClearall = () => {
        const confirmBox = window.confirm("Do you want to delete the current table?");
        if (confirmBox) {
            setLoading(true);
            const controller = new AbortController();
          
            const deleteAllRooms = async () => {
                try {
                    for (const room of rows) {
                        await axiosPrivate.delete(`${url}/${room.room_no}`, { signal: controller.signal });
                    }
                    setRows([]);  
                    setLoading(false);
                    alert("All rooms have been deleted.");
                }catch (error) {
                    if (error.name === 'CanceledError' || error.name === 'AbortError'){
                        console.log('Request canceled');
                    }else{
                      console.error(error);
                      alert("Failed to delete all rooms.");
                    }
                    setLoading(false);
                }
            };
            deleteAllRooms();
        }
    };

    const handleNext = () => {
        navigate('/exam-schedule')
    }

    return (
        <div className="bg-[var(--background)] flex flex-col flex-grow md:w-5/6">
            <div className="px-8 pt-4 mt-6">
                <h2 className="text-xl font-bold mb-3">ADD ROOM</h2>
                <form ref={formRef} className="flex hw:flex-col flex-row justify-between" onSubmit={handleRoom}>
                    <Input input_id="room-no" title="Room No" inputRef={roomNoRef} type="text" placeholder="Enter the room number" required />
                    <Dropdown id="branch" title="Floor No" inputRef={floorNoRef} 
                    options={[
                      { label: 'Ground', value: 0 },
                      { label: 'First',  value: 1 },
                      { label: 'Second', value: 2 },
                    ]}
                    required />
                    <Dropdown id="slot" title="Building" inputRef={buildingRef} options={['Main building', 'SMS building', 'CC building']} required />
                    <Input input_id="total-seats" title="Available Seats" inputRef={capacityRef} type="text" placeholder="Enter the number of seats available" required />
                    <button className="bg-blue-500 hover:bg-blue-400 text-white font-Outfit-Bold py-1 px-2 my-7 mx-2 h-10 w-[5rem] rounded-[20px]" type="submit">ADD</button>
                </form>
            </div>

            <div className="px-8 py-4">
                <h2 className="text-xl font-bold mb-3">AVAILABLE ROOMS</h2>
                <div className={`flex flex-wrap items-center bg-gray-100 p-4 rounded-md font-regular`}>
                    <div className="flex-grow flex flex-row items-center">
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
                            placeholder="Search"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 mx-2 my-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blue-save)] text-gray-600"
                        />
                    </div>
                    <div className="flex-grow flex flex-row">
                        <div className="flex-grow flex flex-row items-center ">
                            <p className="ml-2 mr-1 whitespace-nowrap">Sort By :</p>
                            <select className="w-full p-[10.4px] m-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blue-save)] text-gray-600"
                                defaultValue="" onChange={(e) => setSortTerm(e.target.value)}>
                                <option value="">Enteries</option>
                                <option value="asc">Floor(0 - 2)</option>
                                <option value="desc">Floor(2 - 0)</option>
                            </select>
                        </div>

                        <div className="flex-grow flex flex-row items-center">
                            <p className="ml-2 mr-1 whitespace-nowrap">Filter By :</p>
                            <select className="w-full p-[10.4px] m-1 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--blue-save)] text-gray-600"
                                defaultValue="nil" onChange={(e) => setFilterTerm(e.target.value)}>
                                <option value="nil" >-</option>
                                'Main building', 'SMS building', 'CC building'
                                <option value="Main building">Main building</option>
                                <option value="SMS building">SMS building</option>
                                <option value="CC building">CC building</option>
                                <option value="0">Ground Floor</option>
                                <option value="1">First Floor</option>
                                <option value="2">Second Floor</option>
                                
                            </select>
                        </div>
                    </div>
                </div>
                <div className="h-72 overflow-y-auto relative">
                    <table className="table-auto w-full">
                        <thead className="sticky top-0">
                            <tr className="bg-[var(--grey-all)] font-bold">
                                <th className="text-center px-4 py-2 rounded-tl-2xl rounded-bl-2xl"><span className="whitespace-nowrap">Room No</span></th>
                                <th className="text-center px-4 py-2"><span className="whitespace-nowrap">Floor No</span></th>
                                <th className="text-center px-4 py-2"><span className="whitespace-nowrap">Building</span></th>
                                <th className="text-center px-4 py-2"><span className="whitespace-nowrap">Available Seats</span></th>
                                <th className="px-4 py-2 rounded-tr-2xl rounded-br-2xl"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6">
                                    <ThreeCircles
                                    height="65"
                                    width="65"
                                    color="#23ca85"
                                    wrapperStyle={{
                                        "position": "absolute",
                                        "left": "47%",
                                        "top": "48%"
                                    }}
                                    visible={true}
                                    />
                                </td>
                            </tr>
      
                            ) : (list.map(item => <ManageRow key={item._id ?? item.room_no} room={item.room_no} floor={item.floor_no} building={item.building}
                                available={item.capacity} handleDelete={handleDelete} />))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="px-8 py-4 mt-4">
                <div className="flex flex-row justify-between items-center">
                    <div>
                        <p className="font-regular">Total Seats Available: {totalCapacity}</p>
                    </div>
                    <div className="flex flex-row gap-10">
                        <button className="bg-gray-500 hover:bg-gray-400 text-white font-bold h-10 w-[10rem] rounded-[20px]" onClick={handleClearall}>CLEAR ALL</button>
                        <button className="bg-green-500 hover:bg-green-400 text-white font-bold h-10 w-[10rem] rounded-[20px]" onClick={handleNext}>NEXT</button>
                    </div>
                </div>
            </div>
        </div >
    );
}
