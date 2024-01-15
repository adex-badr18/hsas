import React from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline, MdOutlineFileDownload } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import { users } from '../../constants';
import { EmptySearch } from '../../components/EmptySearch';
import { HiUser } from 'react-icons/hi';
import { getUserProfile } from '../../api';
import { requireAuth } from '../../utils';

export async function loader({ request }) {
    await requireAuth(request);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const data = await getUserProfile(currentUser.userId, request);

    if (!data.user) {
        return {
            error: `${data.error}: ${data.message}`
        };
    }

    return data;
}

const UserView = () => {
    const userData = useLoaderData();

    return (
        <div className="mt-6 min-h-screen w-full font-poppins">
            <div className="mb-10">
                <nav aria-label="breadcrumb">
                    <ol className="flex space-x-2">
                        <li><Link to="/user" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Home</Link></li>
                        <li className="text-purple-700 font-medium text-lg" aria-current="page">Profile</li>
                    </ol>
                </nav>

                <div className="flex justify-between items-center w-full mt-6">
                    <h1 className="font-bold text-primary text-2xl leading-tight">Profile</h1>
                    <div className="flex items-center gap-2">
                        <Link to={`/user/profile/update`} state={{ userData }} className="text-grey-lighter py-2 px-2 rounded-md bg-blue-600 hover:bg-blue-700">
                            <MdOutlineEdit size={22} color='white' />
                        </Link>
                    </div>
                </div>
            </div>

            {
                userData.error ?
                    <h1>{userData.error}</h1> :
                    <div className="flex flex-col sm:flex-row gap-10">
                        <div className="flex justify-center">
                            {
                                userData.img ?
                                    <div className="w-40 h-40 border-primary border-2 rounded-full p-1">
                                        <img src={userData.img} className='rounded-full' alt={``} />
                                    </div> :
                                    <HiUser size={200} color='#07074D' className='rounded-full border-primary border-2 p-3' />
                            }
                        </div>

                        <fieldset className="w-full border-2 border-gray-300 rounded-md px-6 py-4 grid grid-cols-1 ss:grid-cols-2 md:grid-cols-3 gap-3">
                            <legend className='font-semibold text-primary px-1'>User Details</legend>

                            <div className="">
                                <h4 className="block text-base font-semibold text-[#07074D]">
                                    ID
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {userData.user.id ? userData.user.id : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className="block text-base font-semibold text-[#07074D]">
                                    Email
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {userData.user.email ? userData.user.email : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Role
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280] capitalize">
                                    {userData.user.role ? userData.user.role : 'N/A'}
                                </p>
                            </div>

                            <div className="">
                                <h4 className="block text-base font-semibold text-[#07074D]">
                                    First Name
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {
                                        userData.firstName ? userData.firstName : 'N/A'
                                    }
                                </p>
                            </div>
                            <div className="">
                                <h4 className="block text-base font-semibold text-[#07074D]">
                                    Last Name
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {userData.lastName ? userData.lastName : 'N/A'}
                                </p>
                            </div>
                            <div className="">
                                <h4 className=" block text-base font-semibold text-[#07074D]">
                                    Specialty
                                </h4>
                                <p className="w-full text-base font-medium text-[#6B7280]">
                                    {userData.speciality ? v : 'N/A'}
                                </p>
                            </div>

                        </fieldset>
                    </div>
            }
        </div>
    )
}

export default UserView;

{/* {
    "id": 1,
    "firstName": null,
    "lastName": null,
    "gender": null,
    "phoneNumber": null,
    "speciality": null,
    "createdAt": "2024-01-08T11:13:21.532Z",
    "updatedAt": "2024-01-08T11:13:21.532Z",
    "doctorId": 3,
    "user": {
        "id": 3,
        "email": "doctor@g.com",
        "role": "doctor",
        "active": true,
        "createdAt": "2024-01-08T11:13:21.089Z",
        "updatedAt": "2024-01-09T16:28:57.238Z"
    }
} */}