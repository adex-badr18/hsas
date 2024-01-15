import { useRef, useState } from 'react';
import { Link, useNavigate, useLoaderData } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import AddButton from '../../components/AddButton';
import Table from '../../components/Table';
import { requireAuth } from '../../utils';
import { getPatients, deletePatient } from '../../api';
import ConfirmModal from '../../components/ConfirmModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function loader({ request }) {
    await requireAuth(request);

    const data = await getPatients(request);

    if (data.message || data.error) {
        return {
            error: data.error ?? data.message
        };
    }

    return data;
}

const ActionButtons = ({ patient }) => {
    const navigate = useNavigate();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [patientId, setPatientId] = useState(null);

    function viewPatient(e) {
        e.preventDefault();

        const patientId = e.currentTarget.getAttribute('data-patient-id');
        navigate(`./${patientId}`);
    }

    function patientDelete(e) {
        e.preventDefault();

        const patientId = e.currentTarget.getAttribute('data-patient-id');
        console.log('PatientId:', patientId);
    }

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
            navigate('/admin/patients');
        }, 3000);
    }

    return (
        <>
            <div className="py-2 px-6 flex items-center justify-center gap-1">
                <button onClick={viewPatient} data-patient-id={patient.id} className='bg-purple-500 hover:bg-purple-600 p-1 rounded-md'><IoEyeOutline size={20} color='white' /></button>

                <Link to={`/admin/patients/create-patient`} state={{ currentPatient: patient }} className="text-grey-lighter py-1 px-1 rounded-md bg-blue-600 hover:bg-blue-700"><MdOutlineEdit size={20} color='white' /></Link>

                <button onClick={openDeleteModal} data-patient-id={patient.id} className="text-grey-lighter py-1 px-1 rounded-md bg-red-600 hover:bg-red-700"><MdDeleteOutline size={20} color='white' /></button>
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
        </>
    )
}

const PatientsList = () => {
    const patients = useLoaderData();

    const columns = [
        { id: 'S/N', header: 'S/N' },
        { id: 'firstName', header: 'firstName' },
        { id: 'lastName', header: 'lastName' },
        { id: 'phoneNumber', header: 'Phone Number' },
        { id: 'dob', header: 'Age' },
        { id: 'address', header: 'Address' },
        { id: 'actions', header: '' },
    ];

    return (
        <div className="mt-6 min-h-screen w-full font-poppins">
            <ToastContainer />
            <div className="pb-6">
                <nav aria-label="breadcrumb">
                    <ol className="flex space-x-2">
                        <li><Link to="/admin" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Dashboard</Link></li>
                        <li className="text-purple-700 font-medium text-lg" aria-current="page">Patients</li>
                    </ol>
                </nav>

                <div className="flex justify-between items-center mb-6 w-full">
                    <h1 className="font-bold text-primary text-2xl leading-tight mt-6">Patients</h1>
                    <AddButton navigateTo={`/admin/patients/create-patient`}>Add New</AddButton>
                </div>
            </div>

            {
                patients.error ?
                    <h1>{patients.error}</h1> :
                    <div className="h-full overflow-auto w-full">
                        {
                            patients.length === 0 ?
                                <EmptySearch headers={['First Name', 'Last Name', 'Age', 'Phone NUmber', 'Next of Kin', 'Address']} type='patients' />
                                :
                                <Table data={patients} columns={columns} render={(patient) => (
                                    <ActionButtons patient={patient} />
                                )} />
                        }
                    </div>
            }
        </div>
    )
}

export default PatientsList;