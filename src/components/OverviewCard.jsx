import clsx from "clsx";

const OverviewCard = ({ id, title, count, icon }) => {
    return (
        <div className="flex justify-between items-center bg-white p-4 rounded-lg min-w-60 flex-1 shadow-sm">
            <div className="flex flex-col gap-2">
                <div className="flex justify-center items-center h-10 w-10 rounded-full bg-blue-200 text-blue-800">
                    {icon}
                </div>
                <p className="text-base font-bold text-primary">{title}</p>
            </div>

            <div
                className={clsx(
                    `flex justify-center items-center text-4xl h-14 min-w-16 font-bold px-2 rounded-lg`,
                    {
                        'text-[#471B80] bg-[#E8D7FF]': id === 'doctors',
                        'text-[#285C3A] bg-[#DCF1E3]': id === 'patients',
                        'text-[#243E80] bg-[#DAE5FF]': id === 'scans',
                        'text-red-900 bg-red-300': id === 'diagnosis'
                    }
                )}>
                {count}
            </div>
        </div>
    )
}

export default OverviewCard;