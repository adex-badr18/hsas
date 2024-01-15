import { useState, useEffect } from 'react';
import { IoSearch } from "react-icons/io5";

const SearchInput = ({ value: initValue, onChange, debounce = 500 }) => {
    const [value, setValue] = useState(initValue);

    useEffect(() => {
        setValue(initValue);
    }, [initValue]);

    // Run 0.5s after set value in state
    useEffect(() => {
        const timeOut = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeOut);
    }, [value]);

    return (
        <div className="relative flex items-center md:mt-0">
            <span className="absolute w-5 h-5 mx-3 text-gray-400 dark:text-gray-600">
                <IoSearch size={18} />
            </span>

            <input
                type="text"
                placeholder="Search"
                value={value}
                onChange={(e) => {setValue(e.target.value)}}
                className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
        </div>
    )
}

export default SearchInput;