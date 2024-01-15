import { useRef, useState } from 'react';
import { Link, useLocation, useLoaderData, useNavigate } from 'react-router-dom';
import { requireAuth } from '../../utils';
import { getUser, updateUserProfile } from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export async function loader({ request }) {
    await requireAuth(request);
    const authenticatedUser = JSON.parse(localStorage.getItem('user'));
    const user = await getUser(authenticatedUser.userId, request);

    if (user.error || user.message) {
        return {
            error: `${user.error ?? ''} ${user.message}`
        }
    }

    return user;
}

const UserForm = () => {
    const { state } = useLocation();
    const user = useLoaderData();
    const navigate = useNavigate()
    const fileRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        gender: user.gender ?? '',
        speciality: user.speciality ?? '',
        phoneNumber: user.phoneNumber ?? '',
        email: user.email ?? '',
        file: '',
    });

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        const elementValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: elementValue
        }));
    }

    function browseImage(e) {
        e.preventDefault();

        fileRef.current?.click();
    }

    function handleImageSelect(e) {
        e.preventDefault();

        const file = e.target.files[0];

        if (file) {
            setSelectedImage(file);
        }

    }

    async function updateProfile(e) {
        e.preventDefault();

        const profileData = new FormData();

        for (const [prop, value] of Object.entries(formData)) {
            profileData.append(prop, String(value));
        }

        profileData.delete('file');
        profileData.append('file', selectedImage ? selectedImage : '');

        const userResponse = await updateUserProfile(user.id, profileData);

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
                            user.role === 'doctor' &&
                            <li><Link to="/user/profile" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Profile</Link></li>
                        }
                        <li className="text-purple-700 font-medium text-lg" aria-current="page">Update Profile</li>
                    </ol>
                </nav>

                <h1 className="font-bold text-primary text-2xl leading-tight mt-6">Update Profile</h1>
            </div>

            <div className="mx-auto w-full">
                <form onSubmit={updateProfile}>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-3 gap-y-6">
                        <div className="">
                            <label
                                htmlFor='email'
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                required
                            />
                        </div>

                        <div className="">
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
                                required
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
                                required
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor='speciality'
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Specialty
                            </label>
                            <input
                                type="text"
                                name="speciality"
                                id="speciality"
                                value={formData.speciality}
                                onChange={handleChange}
                                placeholder="Specialty"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                required
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor='phoneNumber'
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="phoneNumber"
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="08034670912"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                required
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor="gender"
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Gender
                            </label>
                            <select
                                name="gender"
                                id="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md">
                                <option value="">--Select an option--</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                        <div className="self-end">
                            <label
                                htmlFor="file"
                                className="mb-1 block text-base font-medium text-[#07074D] sr-only"
                            >
                                Profile Image
                            </label>
                            <input
                                type="file"
                                name="file"
                                id="file"
                                ref={fileRef}
                                onChange={handleImageSelect}
                                placeholder="Next of Kin"
                                className="w-full rounded-s-md h-[50px] border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md hidden"
                            />
                            <div className="flex items-end gap-4">
                                <button onClick={browseImage} className="hover:shadow-form rounded-md bg-[#6A64F1] hover:bg-[#5f58f1] py-3 px-8 text-center text-base font-semibold text-white outline-none">{selectedImage ? 'Change Profile Image' : 'Browse Profile Image'}</button>
                                <p className="font-poppins font-medium text-lg">{selectedImage ? selectedImage.name : 'No file chosen'}</p>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end mt-6'>
                        <button
                            type='submit'
                            className="hover:shadow-form rounded-md bg-[#6A64F1] hover:bg-[#5f58f1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserForm;