import { Link, useNavigate } from "react-router-dom";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { EmptySearch } from "./EmptySearch";

const DashboardTable = ({ data }) => {
    const navigate = useNavigate();

    function viewScan(e) {
        e.preventDefault();

        const scanId = e.currentTarget.getAttribute('data-scan-id');
        navigate(`scans/${scanId}`);
    }

    return (
        <>
            {
                data.length === 0 ?
                    <EmptySearch headers={['Patient', 'User', 'Scan Type', 'Diagnosis', 'Scan Date']} type='scans' />
                    :
                    (<div className="overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr className="">
                                    <th scope="col" className="py-3 px-6 text-base font-medium tracking-wider text-left text-gray-700 capitalize dark:text-gray-400">
                                        S/N
                                    </th>
                                    <th scope="col" className="py-3 px-6 text-base font-medium tracking-wider text-left text-gray-700 capitalize dark:text-gray-400">
                                        Patient
                                    </th>
                                    <th scope="col" className="py-3 px-6 text-base font-medium tracking-wider text-left text-gray-700 capitalize dark:text-gray-400">
                                        Doctor
                                    </th>
                                    <th scope="col" className="py-3 px-6 text-base font-medium tracking-wider text-left text-gray-700 capitalize dark:text-gray-400">
                                        Scan Type
                                    </th>
                                    <th scope="col" className="py-3 px-6 text-base font-medium tracking-wider text-left text-gray-700 capitalize dark:text-gray-400">
                                        Diagnosis
                                    </th>
                                    <th scope="col" className="py-3 px-6 text-base font-medium tracking-wider text-left text-gray-700 capitalize dark:text-gray-400">
                                        Scan Date
                                    </th>
                                    <th scope="col" className="py-3 px-6 text-base font-medium tracking-wider text-left text-gray-700 capitalize dark:text-gray-400">

                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {
                                    data.map((scan, index) => (
                                        <tr key={scan.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                            <td className="table-data">{`${index + 1}.`}</td>
                                            <td className="table-data">
                                                {
                                                    scan.patient?.firstName || scan.patient?.lastName ?
                                                        `${scan.patient?.firstName} ${scan.patient?.lastName}` :
                                                        scan.patientId ? scan.patientId : 'N/A'
                                                }
                                            </td>
                                            <td className="table-data">
                                                {
                                                    scan.doctor?.firstName || scan.doctor?.lastName ?
                                                        `Dr. ${scan.doctor?.firstName ?? ''} ${scan.doctor?.lastName ?? ''}` :
                                                        scan.doctorId ? scan.doctorId : 'N/A'
                                                }
                                            </td>
                                            <td className="table-data">{scan.type}</td>
                                            <td className="table-data">{scan.diagnosis}</td>
                                            <td className="table-data">{new Date(scan.createdAt).toDateString()}</td>
                                            <td className="py-4 px-6 font-medium flex items-center justify-center gap-1">
                                                <button onClick={viewScan} data-scan-id={scan.id} className='bg-purple-500 hover:bg-purple-600 p-1 rounded-md'>
                                                    <IoEyeOutline size={20} color='white' />
                                                </button>

                                                <Link to={scan.url} className='bg-blue-500 hover:bg-blue-600 p-1 rounded-md'>
                                                    <MdOutlineFileDownload size={20} color='white' />
                                                </Link>
                                            </td>
                                        </tr>

                                    ))
                                }

                            </tbody>
                        </table>
                    </div>)
            }
        </>
    )
}

export default DashboardTable;