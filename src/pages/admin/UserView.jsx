import { useState } from 'react';
import { Link, useLoaderData, useActionData, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline, MdOutlineFileDownload } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import { HiUserCircle } from 'react-icons/hi';
import { IoEyeOutline } from "react-icons/io5";
import { users, scans } from '../../constants';
import { EmptySearch } from '../../components/EmptySearch';
import { IoSearch } from 'react-icons/io5';
import { getUser, activateUser, deactivateUser, deleteUser } from '../../api';
import { requireAuth } from '../../utils';
import Table from '../../components/Table';
import ConfirmModal from '../../components/ConfirmModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function loader({ params, request }) {
    await requireAuth(request);

    const data = await getUser(params.id, request);


    if (data.error || data.message) {
        return {
            error: data.message ?? data.error
        }
    }

    return data;
}

const ActionButtons = ({ scan }) => {
    const navigate = useNavigate();

    function viewScan(e) {
        e.preventDefault();

        const scanId = e.currentTarget.getAttribute('data-scan-id');
        navigate(`/admin/scans/${scanId}`);
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

const UserView = () => {
    const user = useLoaderData();
    const navigate = useNavigate();
    const location = useLocation();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userId, setUserId] = useState(null);

    const columns = [
        { id: 'S/N', header: 'S/N' },
        { id: 'patientName', header: 'Patient' },
        { id: 'userName', header: 'Doctor' },
        { id: 'scanType', header: 'Type' },
        { id: 'scanDiagnosis', header: 'Diagnosis' },
        { id: 'scanDate', header: 'Date' },
        { id: 'actions', header: '' },
    ];

    function openDeleteModal(e) {
        e.preventDefault();

        const dataUserId = e.currentTarget.getAttribute('data-user-id');
        setIsConfirmOpen(true);
        setUserId(dataUserId);
    }

    async function userDelete(e) {
        e.preventDefault();

        const user = await deleteUser(userId);

        if (user.unAuthorize) {
            const pathname = location.pathname;
            return redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
        }

        if (user.error || user.message) {
            toast.error(`${user.error}: ${user.message}`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            console.log(user);
            setIsConfirmOpen(false);
            return user.error;
        }

        toast.success(`User deleted successfully!`, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        });

        setTimeout(() => {
            return redirect('/admin/users');
        }, 3000);
    }

    async function userActivate(e) {
        e.preventDefault();

        const userId = e.currentTarget.getAttribute('data-user-id');

        const user = await activateUser(userId);

        if (user.unAuthorize) {
            const pathname = location.pathname;
            console.log(pathname);
            return redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
        }

        if (user.error || user.message) {
            toast.error(`${user.error}: ${user.message}`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            return user.error;
        }

        toast.success(`User activated successfully!`, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        });

        setTimeout(() => {
            window.location.reload(true);
        }, 3000);
    }

    async function userDeactivate(e) {
        e.preventDefault();

        const userId = e.currentTarget.getAttribute('data-user-id');

        const user = await deactivateUser(userId);

        if (user.unAuthorize) {
            const pathname = location.pathname;
            console.log(pathname);
            return redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
        }

        if (user.error || user.message) {
            toast.error(`${user.error}: ${user.message}`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            return user.error;
        }

        toast.success(`User deactivated successfully!`, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        });

        setTimeout(() => {
            window.location.reload(true);
        }, 3000);
    }

    return (
        <div className="mt-6 min-h-screen w-full font-poppins">
            <ToastContainer />
            <div className="mb-6">
                <nav aria-label="breadcrumb">
                    <ol className="flex space-x-2">
                        <li><Link to="/admin" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Dashboard</Link></li>
                        <li><Link to="/admin/users" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Users</Link></li>
                        <li className="text-purple-700 font-medium text-lg" aria-current="page">User</li>
                    </ol>
                </nav>

                <div className="flex justify-between items-center w-full mt-6">
                    <h1 className="font-bold text-primary text-2xl leading-tight">User</h1>
                    <div className="flex items-center gap-4">
                        <Link to={`/admin/users/create-user`} state={{ currentUser: user }} className="text-grey-lighter py-2 px-2 rounded-md bg-blue-600 hover:bg-blue-700"><MdOutlineEdit size={22} color='white' /></Link>

                        {
                            user.active ?
                                <button onClick={userDeactivate} data-user-id={user.id} className="text-grey-lighter py-2 px-2 rounded-md bg-red-700 hover:bg-red-900"><FaUserXmark size={22} color='white' /></button>
                                :
                                <button onClick={userActivate} data-user-id={user.id} className="text-grey-lighter py-2 px-2 rounded-md bg-green-700 hover:bg-green-900"><FaUserCheck size={22} color='white' /></button>
                        }

                        <button onClick={openDeleteModal} data-user-id={user.id} className="text-grey-lighter py-2 px-2 rounded-md bg-red-700 hover:bg-red-800"><MdDeleteOutline size={22} color='white' /></button>
                    </div>
                </div>
            </div>

            {
                user.error ?
                    <h1>{user.error}</h1> :

                    <div className="flex flex-col">
                        <div className="mb-4 flex justify-center sm:justify-start">
                            {
                                user.img ?
                                    <img src={user.img} className='w-32 rounded-full' alt={`${user.firstName} ${user.lastName}`} />
                                    :
                                    <HiUserCircle className='rounded-full text-primary' size={150} />
                            }
                        </div>

                        <div className="flex flex-col xl:flex-row xl:gap-6">
                            {
                                user.scan &&
                                <div className="order-2">
                                    {
                                        user.scans?.length === 0 ?
                                            <EmptySearch headers={['Patient', 'Type', 'Diagnosis', 'Date', 'Download']} type='scans' />
                                            :
                                            <Table data={user.scans} columns={columns} render={scan => (
                                                <ActionButtons scan={scan} />
                                            )} />
                                    }
                                </div>
                            }

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
                                                <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">Delete User</h3>
                                                <div className="mt-2">
                                                    <p className="text-base text-gray-600">Proceed to delete user</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button type="button" onClick={userDelete} className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Delete</button>
                                        <button type="button" onClick={() => setIsConfirmOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                                    </div>
                                </div>
                            </ConfirmModal>

                            <fieldset className="w-full border-2 border-gray-300 rounded-md px-6 py-4 mb-4 grid grid-cols-1 ss:grid-cols-2 sm:grid-cols-3 gap-3">
                                <legend className='font-semibold text-primary px-1'>User Details</legend>

                                <div className="">
                                    <h4 className="block text-base font-semibold text-[#07074D]">
                                        ID
                                    </h4>
                                    <p className="w-full text-base font-medium text-[#6B7280]">
                                        {
                                            user.id ? user.id : 'N/A'
                                        }
                                    </p>
                                </div>
                                <div className="">
                                    <h4 className="block text-base font-semibold text-[#07074D]">
                                        Email
                                    </h4>
                                    <p className="w-full text-base font-medium text-[#6B7280]">
                                        {
                                            user.email ? user.email : 'N/A'
                                        }
                                    </p>
                                </div>
                                <div className="">
                                    <h4 className=" block text-base font-semibold text-[#07074D]">
                                        Role
                                    </h4>
                                    <p className="w-full text-base font-medium text-[#6B7280]">
                                        {
                                            user.role ? user.role : 'N/A'
                                        }
                                    </p>
                                </div>
                                <div className="">
                                    <h4 className="block text-base font-semibold text-[#07074D]">
                                        First Name
                                    </h4>
                                    <p className="w-full text-base font-medium text-[#6B7280]">
                                        {
                                            user.firstName ? user.firstName : 'N/A'
                                        }
                                    </p>
                                </div>
                                <div className="">
                                    <h4 className="block text-base font-semibold text-[#07074D]">
                                        Last Name
                                    </h4>
                                    <p className="w-full text-base font-medium text-[#6B7280]">
                                        {
                                            user.lastName ? user.lastName : 'N/A'
                                        }
                                    </p>
                                </div>
                                <div className="">
                                    <h4 className=" block text-base font-semibold text-[#07074D]">
                                        Specialty
                                    </h4>
                                    <p className="w-full text-base font-medium text-[#6B7280]">
                                        {
                                            user.speciality ? user.speciality : 'N/A'
                                        }
                                    </p>
                                </div>
                                {
                                    user.scans &&
                                    <div className="">
                                        <h4 className=" block text-base font-semibold text-[#07074D]">
                                            Total Scans
                                        </h4>
                                        <p className="w-full text-base font-medium text-[#6B7280]">
                                            {user.scans.length}
                                        </p>
                                    </div>
                                }
                            </fieldset>

                        </div>
                    </div>
            }
        </div>
    )
}

export default UserView;