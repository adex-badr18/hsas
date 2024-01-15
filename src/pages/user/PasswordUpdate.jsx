import { useRef, useState, useEffect } from 'react';
import { Link, useLocation, useLoaderData, useNavigate } from 'react-router-dom';
import { requireAuth } from '../../utils';
import { updateUserPassword } from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// export async function loader({ request }) {
//     await requireAuth(request);
//     const authenticatedUser = JSON.parse(localStorage.getItem('user'));
//     const user = await getUser(authenticatedUser.userId, request);

//     if (user.error || user.message) {
//         return {
//             error: `${user.error ?? ''} ${user.message}`
//         }
//     }

//     return user;
// }

const PasswordUpdate = () => {
    const { pathname } = useLocation();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
    }, []);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        const elementValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: elementValue
        }));
    }

    async function changePassword(e) {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error(`Password mismatch`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });

            setError('New password and confirm password do not match');
            return;
        }

        const passwordData = new FormData();

        passwordData.append('currentPassword', formData.currentPassword);
        passwordData.append('newPassword', formData.newPassword);


        const userResponse = await updateUserPassword(user.id, passwordData);

        if (userResponse.unAuthorize) {
            navigate(`/?message=Please log in to continue&redirectTo=${pathname}`);
        }

        if (userResponse.error || userResponse.message) {
            toast.error(`${userResponse.error} ${userResponse.message}`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });

            return {
                error: userResponse.error
            }
        }

        toast.success(`Password changed successfully!`, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        });

        setTimeout(() => {
            if (user.role === 'doctor') {
                navigate(`/user/profile`);
            }
            navigate(`/user`);
        }, 3000);
    }

    return (
        <div className="flex flex-col pt-6 font-poppins">
            <ToastContainer />
            <div className="pb-6">
                <nav aria-label="breadcrumb">
                    <ol className="flex space-x-2">
                        <li><Link to="/user" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Home</Link></li>
                        {
                            user?.role === 'doctor' &&
                            <li><Link to="/user/profile" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Change Password</Link></li>
                        }
                        <li className="text-purple-700 font-medium text-lg" aria-current="page">Change Password</li>
                    </ol>
                </nav>

            </div>

            <div className="mx-auto w-full">
                <form onSubmit={changePassword} className='w-full sm:w-[50%] mx-auto'>
                    <h1 className="font-bold text-primary text-2xl leading-tight my-6">Change Password</h1>
                    <div className="grid grid-cols-1 px-32 py-10 gap-y-6 mx-auto border-2 border-gray-300 rounded-md">
                        <div className="">
                            <label
                                htmlFor='currentPassword'
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                id="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Current Password"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                required
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor='newPassword'
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="New Password"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                required
                            />
                        </div>
                        {
                            error &&
                            <h1 className='text-red-600 text-base'>{error}</h1>
                        }
                        <div className="">
                            <label
                                htmlFor='confirmPassword'
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm New Password"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                required
                            />
                        </div>
                        <div className='flex justify-end mt-6'>
                            <button
                                type='submit'
                                className="hover:shadow-form rounded-md bg-[#6A64F1] hover:bg-[#5f58f1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default PasswordUpdate;