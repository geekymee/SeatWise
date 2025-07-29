export default function DropDown({ input_id, title, inputRef, options, isTarget, handleSlot }) {
    const handleChange = () => {
        if (isTarget) {
            handleSlot();
        }
    }

    return (
        <div className="flex flex-col mb-2 md:mr-4">
            <label className="text-gray-700 font-bold mb-2 pl-2" htmlFor={input_id}>{title}</label>
            <select id={input_id} ref={inputRef} onChange={handleChange} className="h-10 px-3 py-2 rounded-[20px] shadow-sm border-gray-300 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-[var(--blue-medium)]">
                {options.map(opt =>
                  typeof opt === 'object'
                    ? <option key={opt.value} value={opt.value}>{opt.label}</option>
                    : <option key={opt} value={opt}>{opt}</option>
                )}
            </select>
        </div>
    );
}