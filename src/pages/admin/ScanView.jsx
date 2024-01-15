import { useState } from 'react';
import { Link, useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline, MdOutlineFileDownload } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import { scans, patients } from '../../constants';
import { EmptySearch } from '../../components/EmptySearch';
import { IoSearch } from 'react-icons/io5';
import { requireAuth } from '../../utils';
import { getScan, deleteScan } from '../../api';
import ConfirmModal from '../../components/ConfirmModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function loader({ params, request }) {
    await requireAuth(request);

    const data = await getScan(params.id, request);

    if (data.error || data.message) {
        return {
            error: data.message ?? data.error
        }
    }

    return data;
}

const ScanView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const scan = useLoaderData();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [scanId, setScanId] = useState(null);

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
        <div className="mt-6 min-h-screen w-full font-poppins">
            <ToastContainer />
            <div className="mb-6">
                <nav aria-label="breadcrumb">
                    <ol className="flex space-x-2">
                        <li><Link to="/admin" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Dashboard</Link></li>
                        <li><Link to="/admin/scans" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Scans</Link></li>
                        <li className="text-purple-700 font-medium text-lg" aria-current="page">Scan</li>
                    </ol>
                </nav>

                <div className="flex justify-between items-center w-full mt-6">
                    <h1 className="font-bold text-primary text-2xl leading-tight">Scan</h1>
                    <div className="flex items-center gap-2">
                        <Link to={scan.url} className="py-2 px-2 rounded-md bg-blue-600 hover:bg-blue-700"><MdOutlineFileDownload size={22} color='white' /></Link>

                        <Link to={`/admin/scans/create-scan`} state={{ currentScan: scan }} className="py-2 px-2 rounded-md bg-blue-600 hover:bg-blue-700"><MdOutlineEdit size={22} color='white' /></Link>

                        <button onClick={openDeleteModal} data-scan-id={scan.id} className="py-2 px-2 rounded-md bg-red-600 hover:bg-red-700"><MdDeleteOutline size={22} color='white' /></button>
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
                </div>
            </div>

            {
                scan.error ?
                    <h1>{scan.error}</h1> :
                    <div className="flex flex-col gap-3">
                        <fieldset className='border-2 border-gray-300 rounded-md px-6 py-4 mb-4 grid grid-cols-1 ss:grid-cols-2 sm:grid-cols-3 gap-3'>
                            <legend className='font-semibold text-primary px-1'>Scan Details</legend>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    ID
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {scan.id ? scan.id : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Type
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {scan.type ? scan.type : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Symptoms
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {scan.symptoms ? scan.symptoms : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Diagnosis
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {scan.diagnosis ? scan.diagnosis : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Date
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {scan.createdAt ? new Date(scan.createdAt).toDateString() : 'N/A'}
                                </p>
                            </div>
                        </fieldset>

                        <fieldset className="w-full border-2 border-gray-300 rounded-md px-6 py-4 mb-4 grid grid-cols-1 ss:grid-cols-2 sm:grid-cols-3 gap-3">
                            <legend className='font-semibold text-primary px-1'>Patient Details</legend>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    ID
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {scan.patientId ? scan.patientId : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className="block text-base font-semibold text-[#07074D]">
                                    Name
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {
                                        scan.patient.firstName || scan.patient.lastName ?
                                            `${scan.patient.firstName} ${scan.patient.lastName}` :
                                            'N/A'
                                    }
                                </p>
                            </div>
                            <div className="">
                                <h4 className="block text-base font-semibold text-[#07074D]">
                                    Gender
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {
                                        scan.patient.gender ? scan.patient.gender : 'N/A'
                                    }
                                </p>
                            </div>
                            <div className="">
                                <h4 className="block text-base font-semibold text-[#07074D]">
                                    Phone Number
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {scan.patient.phoneNumber ? scan.patient.phoneNumber : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Date of Birth
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {scan.patient.dob ? new Date(scan.patient.dob).toDateString() : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Age
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {scan.patient.dob ? new Date().getFullYear() - new Date(scan.patient.dob).getFullYear() : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Address
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {scan.patient.address ? scan.patient.address : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Next of Kin Name
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {scan.patient.nextOfKinName ? scan.patient.nextOfKinName : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Next of Kin Phone
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {scan.patient.nextOfKinPhone ? scan.patient.nextOfKinPhone : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Next of Kin Relationship
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {
                                        scan.patient.nextOfKinRelationship ? scan.patient.nextOfKinRelationship : 'N/A'
                                    }
                                </p>
                            </div>
                        </fieldset>

                        <fieldset className='border-2 border-gray-300 rounded-md px-6 py-4 mb-4 grid grid-cols-1 ss:grid-cols-2 sm:grid-cols-3 gap-3'>
                            <legend className='font-semibold text-primary px-1'>Doctor Details</legend>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    ID
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {
                                        scan.doctorId ? scan.doctorId : 'N/A'
                                    }
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Name
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {
                                        scan.doctor.firstName || scan.doctor.lastName ?
                                            `${scan.doctor.firstName} ${scan.doctor.lastName}` :
                                            'N/A'
                                    }
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Email
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {
                                        scan.doctor.email ? scan.doctor.email : 'N/A'
                                    }
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Specialty
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {
                                        scan.doctor.speciality ? scan.doctor.speciality : 'N/A'
                                    }
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Role
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {
                                        scan.doctor.role ? scan.doctor.role : 'N/A'
                                    }
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Gender
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {
                                        scan.doctor.gender ? scan.doctor.gender : 'N/A'
                                    }
                                </p>
                            </div>
                        </fieldset>
                    </div>
            }
        </div>
    )
}

export default ScanView;