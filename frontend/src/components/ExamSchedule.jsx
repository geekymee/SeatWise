import Dropdown from './Dropdown';
import { useState, useRef, useEffect, useMemo } from 'react';
import Input from './Input';
import { ThreeCircles } from 'react-loader-spinner'
import ExamScheduleRow from './ExamScheduleRow';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';


const url = '/exam-schedule';

export default function ExamSchedule() {
    const [loading, setLoading] = useState(true);
    const [exams, setExams] = useState([]);
    const [toggle, setToggle] = useState(false); 
    
    const semRef = useRef();
    const formRef = useRef();
    const dateRef = useRef();
    const branchRef = useRef();
    const slotRef = useRef();
    const subRef = useRef();

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();


    const sortedExams = useMemo(() => {
        let list = exams.sort((a, b) => { return a.date.split("/").join("") - b.date.split("/").join("") });
        if (list.length > 0 && toggle)
            list = list.sort((a, b) => { if (a.branch < b.branch) { return -1; } if (a.branch > b.branch) { return 1; } return 0; });
        return list;
    }, [exams, toggle]);

    const handleToggle = () => {
        setToggle(!toggle);
    }
    
    const handleFiles = () => {
        setLoading(true);
        const controller = new AbortController();

        const sendFiles = async () => {
            const myFiles = document.getElementById('myFiles').files;
            console.log(myFiles);

            const formData = new FormData();

            Object.keys(myFiles).forEach(key => {
                formData.append(myFiles.item(key).name, myFiles.item(key));
            });

            console.log(formData);

            try {
                const response = await axiosPrivate.post(url.concat("/file-upload"), formData, {
                    signal: controller.signal,
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setLoading(false);
                alert(response.data.message + " excel file successfully uploaded");
            } catch (error) {
                alert("Excel file upload unsuccessful");
                console.log(error);
            }

        }

        sendFiles();

        return () => {
            controller.abort();
        }
    }

    const handleSchedule = (e) => {
        e.preventDefault();
        setLoading(true);
        const newExam = { date: dateRef.current.value, sem: Number(semRef.current.options[semRef.current.selectedIndex].value), branch: branchRef.current.value, slot: slotRef.current.value, subcode: subRef.current.value };
        formRef.current.reset();
        dateRef.current.focus();

        console.log(newExam);

        let isMounted = true;
        const controller = new AbortController();

        const postSchedule = async () => {
            try {
                const response = await axiosPrivate.post(url, newExam, {
                    signal: controller.signal
                });
                isMounted && setExams(prev => [...prev, response.data]);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        postSchedule();

        semRef.current.focus();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    const handleSlot = () => {
        let isMounted = true;
        const controller = new AbortController();

        const subInfo = { sem: Number(semRef.current.options[semRef.current.selectedIndex].value), branch: branchRef.current.value, slot: slotRef.current.value }

        console.log(subInfo);

        // const getSubcode = async () => {
        //     try {
        //         const response = await axiosPrivate.get(url, {
        //             params: subInfo,
        //             signal: controller.signal
        //         });
        //         if (isMounted) {
        //             console.log(response.data);
        //             setSubjects(response.data);
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }

        // getSubcode();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const subInfo = { sem: Number(semRef.current.options[semRef.current.selectedIndex].value), branch: branchRef.current.value, slot: slotRef.current.value }

        console.log(subInfo);

        // const getSubcode = async () => {
        //     try {
        //         const response = await axiosPrivate.get(url, {
        //             params: subInfo,
        //             signal: controller.signal
        //         });
        //         if (isMounted) {
        //             console.log(response.data);
        //             setSubjects(response.data);
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }

        // getSubcode();

        const getSchedule = async () => {
            try {
                const response = await axiosPrivate.get(url.concat("/schedule"), {
                    signal: controller.signal
                });
                isMounted && setExams(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        isMounted && getSchedule();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [axiosPrivate])

    const handleDelete = (id) => {
        setLoading(true);
        let isMounted = true;
        const controller = new AbortController();

        const deleteSchedule = async () => {
            try {
                await axiosPrivate.delete(url.concat(`/${id}`), {
                    signal: controller.signal
                });
                isMounted && setExams(prev => prev.filter(item => item._id !== id));
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        deleteSchedule();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }

    const handleClearall = () => {
        const confirmBox = window.confirm("Do you want to delete the current schedule?");
        if (confirmBox) {
            setLoading(true);
            const controller = new AbortController();
          
            const deleteSchedule = async () => {
                try {
                    for (const exam of exams) {
                        await axiosPrivate.delete(`${url}/${exam._id}`, { signal: controller.signal });
                    }
                    setRows([]);  
                    setLoading(false);
                    alert("The schedule has been deleted.");
                }catch (error) {
                    if (error.name === 'CanceledError' || error.name === 'AbortError'){
                        console.log('Request canceled');
                    }else{
                      alert("Failed to delete the schedule.");
                    }
                    setLoading(false);
                }
            };
            deleteSchedule();
        }
    };

    const handleNext = () => {
        navigate('/room-allocation-review')
    }

    return (
        <div className="bg-[var(--background)] flex flex-col flex-grow md:w-5/6">
            <div className="px-8 pt-4 flex flex-row justify-between flex-wrap">
                <div className="flex flex-row mt-6 items-center">
                    <h2 className="text-xl font-bold"><span className="whitespace-nowrap">SELECT SEMESTER</span></h2>
                    <select ref={semRef} className="h-10 px-3 py-2 ml-5 rounded-[20px] shadow-sm border-gray-300 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-[var(--bule-save)]" onChange={handleSlot}>
                        <option value="1">Semester 1</option>
                        <option value="2">Semester 2</option>
                        <option value="3">Semester 3</option>
                        <option value="4">Semester 4</option>
                        <option value="5">Semester 5</option>
                        <option value="6">Semester 6</option>
                        <option value="7">Semester 7</option>
                        <option value="8">Semester 8</option>
                    </select>
                </div>

                <div className="flex flex-row justify-center items-center mt-6">
                    <h2 className="text-xl font-bold"><span className="whitespace-nowrap">EXAMINEE DETAILS</span></h2>
                    <input type="file" id="myFiles" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" multiple className="font-regular ml-5 rounded-[20px] shadow-sm border-gray-300 px-3 py-2 mr-5  hover:bg-[var(--blue-login)] hover:text-white" />
                    <button className="bg-[var(--blue-medium)] hover:bg-[var(--blue-light)] text-white font-bold h-10 w-[10rem] rounded-[20px]" onClick={handleFiles}>UPLOAD FILE</button>
                </div>
            </div>
             

            <div className="px-8 pt-6 my-1">
                <h2 className="text-xl font-bold mb-3">ADD SLOTS</h2>
                <form ref={formRef} className="flex flex-col st:flex-row justify-between" onSubmit={handleSchedule}>
                    <Input input_id="date" title="Date" inputRef={dateRef} type="date" placeholder="Enter Exam Date" />
                    <Dropdown input_id="branch" title="Branches" inputRef={branchRef} options={['CSE', 'ECE', 'EE', 'ME', 'CE', 'CHE', 'BT', 'ECM', 'PIE']} isTarget handleSlot={handleSlot} />
                    <Dropdown input_id="slot" title="Slot" inputRef={slotRef} options={['morning' , 'afternoon']} isTarget handleSlot={handleSlot} />
                    <Input input_id="subject" title="Subject" inputRef={subRef} type="string" placeholder="Enter subject code" />
                    <button className="bg-[var(--blue-medium)] hover:bg-[var(--blue-light)] text-white font-bold py-1 px-2 my-7 mx-2 h-10 w-[5rem] rounded-[20px]" type="submit">ADD</button>
                </form>
            </div>

            <div className="px-8 py-5">
                <h2 className="text-xl font-bold mb-4">EXAM SCHEDULES</h2>
                <div className="h-72 overflow-y-auto relative">
                    <table className="table-auto w-full">
                        <thead className="sticky top-0">
                            <tr className="bg-grey-all font-bold">
                                <th className="text-center px-4 py-2 rounded-tl-2xl rounded-bl-2xl"><span className="whitespace-nowrap">Date</span></th>
                                <th className="text-center px-4 py-2"><span className="whitespace-nowrap">Semester</span></th>
                                <th className="text-center px-4 py-2"><span className="whitespace-nowrap">Branch</span></th>
                                <th className="text-center px-4 py-2"><span className="whitespace-nowrap">Slot</span></th>
                                <th className="text-center px-4 py-2"><span className="whitespace-nowrap">Subject</span></th>
                                <th className="text-center pt-2 rounded-tr-2xl rounded-br-2xl ">
                                    <div className="flex items-center justify-center mb-2">
                                        <div className={`w-9 h-5 rounded-full cursor-pointer flex ${toggle ? "bg-green-600 p-1 pl-2" : "bg-gray-600 p-1"}`}
                                            onClick={handleToggle} title={`${toggle ? "Sort By Date" : "Sort By Branch"}`}>
                                            <div className={`w-3 h-3 rounded-full bg-white ${toggle ? "translate-x-full" : ""}`}></div>
                                        </div>
                                    </div>
                                </th>
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
                                visible={true}/>
                                    </td>
                                </tr>

                            ) : (sortedExams.map(item => <ExamScheduleRow key={item._id} id={item._id} date={item.date} sem={item.sem} branch={item.branch} slot={item.slot} subcode={item.subcode} handleDelete={handleDelete} />))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="px-8 py-4 mt-3">
                <div className="flex flex-row justify-between items-center">
                    <div>
                        <p className="font-regular">No of Exams scheduled : {exams.length}</p>
                    </div>
                    <div className="flex flex-row gap-10">
                        <button className="bg-gray-500 hover:bg-gray-400 text-white font-bold h-10 w-[10rem] rounded-[20px]" onClick={handleClearall}>CLEAR ALL</button>
                        <button className="bg-[var(--blue-medium)] hover:bg-[var(--blue-light)] text-white font-bold h-10 w-[10rem] rounded-[20px]" onClick={handleNext}>NEXT</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
