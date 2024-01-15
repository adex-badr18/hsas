import { useState, useRef } from 'react';
import { Link, useLocation, useNavigate, Form } from 'react-router-dom';
import { MdOutlineSyncLock } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUser, updateUser } from '../../api';
import { loader } from '../Home';
import { requireAuth } from '../../utils';

export async function action({ request }) {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');
    const intent = formData.get('intent');

    const data = {
        email,
        role,
        active: true,
        password
    }

    console.log(data);

    if (intent === 'create') {
        try {
            const user = await createUser(data);

            if (user.error) {
                toast.error(`Error: ${user.error}`, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });

                return {
                    error: user.error
                }
            }

            toast.success(`User successfully created!`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });

            return redirect('/admin/users');
        } catch (error) {
            return error;
        }
    }

}

const UserForm = () => {
    const { state } = useLocation();
    const location = useLocation();
    const navigate = useNavigate();
    const user = state && state.currentUser;
    const passwordRef = useRef(null);
    const emailRef = useRef(null);
    const [image, setImage] = useState(null);
    const fileRef = useRef(null);
    const [formData, setFormData] = useState(user ?
        {
            email: user.email,
            role: user.role,
            password: user.password ?? '',
            active: user.active
        } :
        {
            email: '',
            role: '',
            password: '',
            active: true
        }
    );

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        const elementValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: elementValue
        }));
    }

    async function submitForm(e) {
        e.preventDefault();

        const btnType = e.target.elements[4].dataset.intent;

        if (btnType === 'create') {
            try {
                const user = await createUser(formData);

                if (user.unAuthorize) {
                    const pathname = location.pathname;
                    navigate(`/?message=Please log in to continue&redirectTo=${pathname}`);
                }

                if (user.error || user.message) {
                    toast.error(`${user.error} ${user.message}`, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    });

                    return {
                        error: user.error
                    }
                }

                toast.success(`User successfully created!`, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });

                setTimeout(() => {
                    navigate(`/admin/users`);
                }, 3000);
            } catch (error) {
                return error;
            }
        }

        if (btnType === 'update') {
            const userResponse = await updateUser(user.id, formData);

            if (userResponse.unAuthorize) {
                const pathname = location.pathname;
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

            toast.success(`User successfully updated!`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });

            setTimeout(() => {
                navigate(`/admin/users`);
            }, 3000);
        }

    }

    function browseImage(e) {
        e.preventDefault();

        fileRef.current?.click();
    }

    function handleImageSelect(e) {
        e.preventDefault();

        const file = e.target.files[0];

        if (file) {
            setImage(file);
        }

    }

    function generatePassword(e) {
        e.preventDefault();

        if (!emailRef.current.value) {
            toast.error(`Specify user email to generate password`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
        }

        passwordRef.current.value = emailRef.current.value.slice(0, 6);
        setFormData(prev => ({
            ...prev,
            password: passwordRef.current.value
        }));
    }

    return (
        <div className="flex flex-col pt-6 font-poppins">
            <ToastContainer />
            <div className="pb-6">
                <nav aria-label="breadcrumb">
                    <ol className="flex space-x-2">
                        <li><Link to="/admin" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Dashboard</Link></li>
                        <li><Link to="/admin/users" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Users</Link></li>
                        <li className="text-purple-700 font-medium text-lg" aria-current="page">User Form</li>
                    </ol>
                </nav>

                <h1 className="font-bold text-primary text-2xl leading-tight mt-6">{state ? 'Update' : 'Create'} User</h1>
            </div>

            <div className="mx-auto w-full">
                <form onSubmit={submitForm}>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-6">
                        <div className="">
                            <label
                                htmlFor='email'
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Email <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                ref={emailRef}
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                required
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor="password"
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Password <span className="text-red-600">*</span>
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    name="password"
                                    id="password"
                                    ref={passwordRef}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full rounded-s-md border border-[#e0e0e0] bg-gray-200 py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    required
                                />
                                <button
                                    onClick={generatePassword}
                                    className="hover:shadow-form rounded-e-md bg-[#6A64F1] hover:bg-[#5f58f1] py-3 px-4 text-center text-base font-semibold text-white outline-none"
                                >
                                    <MdOutlineSyncLock size={22} color='white' />
                                </button>
                            </div>
                        </div>
                        <div className="">
                            <label
                                htmlFor="role"
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Role
                            </label>
                            <select
                                name="role"
                                id="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md">
                                <option value="">--Select an option--</option>
                                <option value="admin">Admin</option>
                                <option value="doctor">Doctor</option>
                                <option value="nurse">Nurse</option>
                            </select>
                        </div>
                        {/* <div className="">
                            <label
                                htmlFor='firstName'
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor="lastName"
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor='specialty'
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Specialty
                            </label>
                            <input
                                type="text"
                                name="specialty"
                                id="specialty"
                                value={formData.specialty}
                                onChange={handleChange}
                                placeholder="Specialty"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor="profileImage"
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Profile Image
                            </label>
                            <input
                                type="file"
                                name="profileImage"
                                id="profileImage"
                                accept='image/*'
                                onChange={handleImageSelect}
                                ref={fileRef}
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md hidden"
                            />
                            <div className="flex items-end gap-4">
                                <button onClick={browseImage} className="hover:shadow-form rounded-md bg-[#6A64F1] hover:bg-[#5f58f1] py-3 px-8 text-center text-base font-semibold text-white outline-none">{image ? 'Change Image' : 'Browse Image'}</button>
                                <p className="font-poppins font-medium text-lg">{image ? image.name : 'No files chosen'}</p>
                            </div>
                        </div> */}
                    </div>

                    <div className='flex justify-end'>
                        {
                            state ?
                                <button type='submit' data-intent='update' className="hover:shadow-form rounded-md bg-[#6A64F1] hover:bg-[#5f58f1] py-3 px-8 text-center text-base font-semibold text-white outline-none">Update User</button> :
                                <button type='submit' data-intent='create' className="hover:shadow-form rounded-md bg-[#6A64F1] hover:bg-[#5f58f1] py-3 px-8 text-center text-base font-semibold text-white outline-none">Create User</button>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserForm;