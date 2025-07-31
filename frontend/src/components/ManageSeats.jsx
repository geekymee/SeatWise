import { useState } from "react";
export default function ManageSeats({ room, capacity, setSelectedRooms, setSeatSelected, bookedRooms }) {
    const [isChecked, setIsChecked] = useState(false);

    const handleChange = () => {
        setIsChecked(!isChecked);
        if (!isChecked) {
            console.log(room);
            setSelectedRooms(prev => [...prev, room]);
            setSeatSelected(prev => prev + capacity);
        }
        else {
            console.log(room);
            setSelectedRooms(prev => prev.filter(item => item !== room));
            setSeatSelected(prev => prev - capacity);
        }
    };
    return (
        <div className={`inline-grid place-items-center ${bookedRooms.length > 0 ? bookedRooms.includes(room) ? 'bg-red-500' : 'bg-[var(--gray-all)]'
            : isChecked ? 'bg-[var(--blue-selected)]' : 'bg-1B7AA3'} w-16 h-16 border-2 rounded-2xl m-2 py-2 cursor-pointer`} checked={isChecked} onClick={bookedRooms.length > 0 ? null : handleChange}>
            <p className="font-bold cursor-pointer select-none">{room}</p>
            <p className={`font-bold ${bookedRooms.length > 0 ? bookedRooms.includes(room) && 'bg-red-500 text-white' : isChecked ? 'text-white' : 'text-black'} cursor-pointer select-none`}>{capacity}</p>
        </div >
    );
}
