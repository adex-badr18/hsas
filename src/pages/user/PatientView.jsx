import { useState } from 'react';
import { Link, useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline, MdOutlineFileDownload } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { EmptySearch } from '../../components/EmptySearch';
import { requireAuth } from '../../utils';
import { deletePatient, getPatient } from '../../api';
import Table from '../../components/Table';
import ConfirmModal from '../../components/ConfirmModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function loader({ params, request }) {
    await requireAuth(request);

    const patient = await getPatient(params.id, request);

    if (patient.error || patient.message) {
        return {
            error: patient.message ?? patient.error
        }
    }

    return patient;
}

const ActionButtons = ({ scan }) => {
    const navigate = useNavigate();

    function viewScan(e) {
        e.preventDefault();

        const scanId = e.currentTarget.getAttribute('data-scan-id');
        navigate(`/user/scans/${scanId}`);
    }

    return (
        <div className="py-2 px-6 flex items-center justify-center gap-1">
            <button onClick={viewScan} data-scan-id={scan.scanId} className='bg-purple-500 hover:bg-purple-600 p-1 rounded-md'>
                <IoEyeOutline size={20} color='white' />
            </button>

            <Link to={scan.scanUrl} className='bg-green-500 hover:bg-green-600 p-1 rounded-md'>
                <MdOutlineFileDownload size={20} color='white' />
            </Link>
        </div>
    )
}

const PatientView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const patient = useLoaderData();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [patientId, setPatientId] = useState(null);

    const columns = [
        { id: 'S/N', header: 'S/N' },
        { id: 'userName', header: 'Doctor' },
        { id: 'scanType', header: 'Type' },
        { id: 'scanDiagnosis', header: 'Diagnosis' },
        { id: 'scanDate', header: 'Date' },
        { id: 'actions', header: '' },
    ];

    function openDeleteModal(e) {
        e.preventDefault();

        const dataPatientId = e.currentTarget.getAttribute('data-patient-id');
        setIsConfirmOpen(true);
        setPatientId(dataPatientId);
    }

    async function patientDelete(e) {
        e.preventDefault();

        // const patientId = e.currentTarget.getAttribute('data-patient-id');
        const patientResponse = await deletePatient(patientId);

        if (patientResponse.unAuthorize) {
            const pathname = location.pathname;
            navigate(`/?message=Please log in to continue&redirectTo=${pathname}`)
        }

        if (patientResponse.error || patientResponse.message) {
            toast.error(`${patientResponse.error}: ${patientResponse.message}`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            console.log(patientResponse);
            setIsConfirmOpen(false);
            return patientResponse.error;
        }

        toast.success(`Patient deleted successfully!`, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        });

        setTimeout(() => {
            navigate('/user/patients')
        }, 3000);
    }

    return (
        <div className="mt-6 min-h-screen w-full font-poppins">
            <ToastContainer />
            <div className="mb-6">
                <nav aria-label="breadcrumb">
                    <ol className="flex space-x-2">
                        <li><Link to="/user" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Home</Link></li>
                        <li><Link to="/user/patients" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Patients</Link></li>
                        <li className="text-purple-700 font-medium text-lg" aria-current="page">Patient</li>
                    </ol>
                </nav>

                <div className="flex justify-between items-center w-full mt-6">
                    <h1 className="font-bold text-primary text-2xl leading-tight">Patient</h1>
                    <div className="flex items-center gap-2">
                        <Link to={`/user/patients/create-patient`} state={{ currentPatient: patient }} className="text-grey-lighter py-2 px-2 rounded-md bg-blue-600 hover:bg-blue-700"><MdOutlineEdit size={22} color='white' /></Link>

                        <button onClick={openDeleteModal} data-patient-id={patient.id} className="text-grey-lighter py-2 px-2 rounded-md bg-red-600 hover:bg-red-700"><MdDeleteOutline size={22} color='white' /></button>
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
                                        <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">Delete Patient</h3>
                                        <div className="mt-2">
                                            <p className="text-base text-gray-600">Proceed to delete patient</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="button" onClick={patientDelete} className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Delete</button>
                                <button type="button" onClick={() => setIsConfirmOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                            </div>
                        </div>
                    </ConfirmModal>
                </div>
            </div>

            {
                patient.error ?
                    <h1>{patient.error}</h1> :
                    <div className="flex flex-col xl:flex-row">
                        {
                            patient.scans &&
                            <div className="order-2">
                                {
                                    patient.scans?.length === 0 ?
                                        <EmptySearch headers={['Doctor', 'Type', 'Diagnosis', 'Date', 'Download']} type='scans' />
                                        :
                                        <Table data={patient.scans} columns={columns} render={scan => (
                                            <ActionButtons scan={scan} />
                                        )} />
                                }
                            </div>
                        }

                        <fieldset className="w-full border-2 border-gray-300 rounded-md px-6 py-4 mb-4 grid grid-cols-1 ss:grid-cols-2 sm:grid-cols-3 gap-3">
                            <legend className='font-semibold text-primary px-1'>Patient Details</legend>
                            <div className="">
                                <h4 className="block text-base font-semibold text-[#07074D]">
                                    ID
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {patient.id}
                                </p>
                            </div>
                            <div className="">
                                <h4 className="block text-base font-semibold text-[#07074D]">
                                    First Name
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {patient.firstName}
                                </p>
                            </div>
                            <div className="">
                                <h4 className="block text-base font-semibold text-[#07074D]">
                                    Last Name
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {patient.lastName}
                                </p>
                            </div>
                            <div className="">
                                <h4 className="block text-base font-semibold text-[#07074D]">
                                    Phone Number
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {patient.phoneNumber}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Date of Birth
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {new Date(patient.dob).toDateString()}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Age
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {
                                        new Date().getFullYear() - new Date(patient.dob).getFullYear()
                                    }
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Gender
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {
                                        patient.gender ?
                                            patient.gender :
                                            'N/A'
                                    }
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Address
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {patient.address}
                                </p>
                            </div>
                            {
                                patient.scans &&
                                <div className="">
                                    <h4 className=" block text-base font-semibold text-[#07074D]">
                                        Total Scans
                                    </h4>
                                    <p className="w-full text-base font-medium text-[#6B7280]">
                                        {patient.scans?.length}
                                    </p>
                                </div>
                            }
                        </fieldset>
                        <fieldset className='border-2 border-gray-300 rounded-md px-6 py-4 mb-4 grid grid-cols-1 ss:grid-cols-2 sm:grid-cols-3 gap-3'>
                            <legend className='font-semibold text-primary px-1'>Next of Kin Details</legend>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Name
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {patient.nextOfKinName}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Relationship
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {patient.nextOfKinRelationship}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Phone Number
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {patient.nextOfKinPhone}
                                </p>
                            </div>
                        </fieldset>
                    </div>
            }
        </div>
    )
}

export default PatientView;