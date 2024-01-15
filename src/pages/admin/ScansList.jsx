import { useState } from 'react';
import { Link, useNavigate, useLoaderData } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline, MdOutlineFileDownload } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { IoSearch, IoEyeOutline } from "react-icons/io5";
import { scans } from '../../constants';
import AddButton from '../../components/AddButton';
import Table from '../../components/Table';
import { requireAuth } from '../../utils';
import { getScans, deleteScan } from '../../api';
import ConfirmModal from '../../components/ConfirmModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function loader({ request }) {
    await requireAuth(request);

    const data = await getScans(request);

    if (data.message || data.error) {
        return {
            error: data.error ?? data.message
        };
    }

    return data;
}

const ActionButtons = ({ scan }) => {
    const navigate = useNavigate();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [scanId, setScanId] = useState(null);

    function viewScan(e) {
        e.preventDefault();

        const scanId = e.currentTarget.getAttribute('data-scan-id');
        navigate(`./${scanId}`);
    }

    function openDeleteModal(e) {
        e.preventDefault();

        const dataScanId = e.currentTarget.getAttribute('data-scan-id');
        setIsConfirmOpen(true);
        setScanId(dataScanId);
    }

    async function scanDelete(e) {
        e.preventDefault();

        const scanResponse = await deleteScan(scanId);

        if (scanResponse.unAuthorize) {
            const pathname = location.pathname;
            navigate(`/?message=Please log in to continue&redirectTo=${pathname}`)
        }

        if (scanResponse.error || scanResponse.message) {
            toast.error(`${scanResponse.error}: ${scanResponse.message}`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            console.log(scanResponse);
            setIsConfirmOpen(false);
            return scanResponse.error;
        }

        toast.success(`Scan deleted successfully!`, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        });

        setTimeout(() => {
            navigate('/admin/scans')
            // return redirect('/admin/users');
            // window.location.reload(true);
        }, 3000);
    }

    return (
        <>
            <div className="py-2 px-6 flex items-center justify-center gap-1">
                <button onClick={viewScan} data-scan-id={scan.id} className='bg-purple-500 hover:bg-purple-600 p-1 rounded-md'>
                    <IoEyeOutline size={20} color='white' />
                </button>

                <Link to={scan.url} className='bg-green-500 hover:bg-green-600 p-1 rounded-md'>
                    <MdOutlineFileDownload size={20} color='white' />
                </Link>

                <Link to={`create-scan`} state={{ currentScan: scan }} className="py-1 px-1 rounded-md bg-blue-600 hover:bg-blue-700"><MdOutlineEdit size={20} color='white' /></Link>

                <button onClick={openDeleteModal} data-scan-id={scan.id} className="py-1 px-1 rounded-md bg-red-600 hover:bg-red-700"><MdDeleteOutline size={20} color='white' /></button>
            </div>

            <ConfirmModal isOpen={isConfirmOpen} toggleModal={setIsConfirmOpen}>
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">Delete Scan</h3>
                                <div className="mt-2">
                                    <p className="text-base text-gray-600">Proceed to delete scan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="button" onClick={scanDelete} className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Delete</button>
                        <button type="button" onClick={() => setIsConfirmOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                    </div>
                </div>
            </ConfirmModal>
        </>
    )
}

const ScansList = () => {
    const navigate = useNavigate();
    const scans = useLoaderData();
    // console.log(scans);

    const columns = [
        { id: 'S/N', header: 'S/N' },
        { id: 'patientId', header: 'Patient' },
        { id: 'doctorId', header: 'Doctor' },
        { id: 'type', header: 'Type' },
        { id: 'diagnosis', header: 'Diagnosis' },
        { id: 'createdAt', header: 'Date' },
        { id: 'actions', header: '' },
    ];

    return (
        <div className="mt-6 min-h-screen w-full font-poppins">
            <ToastContainer />
            <div className="mb-10">
                <nav aria-label="breadcrumb">
                    <ol className="flex space-x-2">
                        <li><Link to="/admin" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Dashboard</Link></li>
                        <li className="text-purple-700 font-medium text-lg" aria-current="page">Scans</li>
                    </ol>
                </nav>

                <div className="flex justify-between items-center w-full">
                    <h1 className="font-bold text-primary text-2xl leading-tight mt-6">Scans</h1>
                    <AddButton navigateTo={`create-scan`}>Add New</AddButton>
                </div>
            </div>

            {
                scans.error ?
                    <h1>{scans.error}</h1> :
                    <div className="h-full overflow-auto w-full">
                        {
                            scans?.length === 0 ?
                                <EmptySearch headers={['Patient', 'Doctor', 'Symptoms', 'Diagnosis', 'Date', 'Scan Link']} />
                                :
                                <Table data={scans} columns={columns} render={scan => (
                                    <ActionButtons scan={scan} />
                                )} />
                        }
                    </div>
            }
        </div>
    )
}

export default ScansList;