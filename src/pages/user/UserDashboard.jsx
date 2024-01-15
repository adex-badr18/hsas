import { Suspense } from 'react';
import Welcome from '../../components/Welcome';
import OverviewCard from "../../components/OverviewCard";
import DashboardTable from "../../components/DashboardTable";
import { doctorCardsInfo, scans } from '../../constants';
import { Link, useLoaderData, defer, Await } from "react-router-dom";
import { HiUser } from 'react-icons/hi';
import { MdOutlineEdit } from 'react-icons/md';
import { FaUserDoctor, FaUserInjured, FaFileMedical, FaStethoscope, FaUserNurse } from "react-icons/fa6";
import { requireAuth } from '../../utils';
import { getUserHomePageData } from '../../api';

export async function loader({ request }) {
    await requireAuth(request);

    const data = await getUserHomePageData(request);

    if (data.message || data.error) {
        return {
            error: `${data.error}: ${data.message}`
        };
    }

    const doctorData = !data.user && data;
    const nurseData = !data.scanCount && data;

    if (doctorData) {
        return { doctor: doctorData };
    }

    return { nurse: nurseData };
}

const UserDashboard = () => {
    const data = useLoaderData();

    const user = JSON.parse(localStorage.getItem('user'));
    const doctorData = !data.error && !data.nurse && data.doctor;
    const nurseData = !data.error && !data.doctor && data.nurse;
    const errorData = data.error && data;

    const dashboardCardsInfo = [
        { id: 'patients', title: 'Total Patients', count: doctorData?.patientCount, icon: <FaUserInjured size={20} /> },
        { id: 'scans', title: 'Total Scans', count: doctorData?.scanCount, icon: <FaFileMedical size={20} /> },
    ];

    const title = user?.role === 'doctor' ? 'Doctor' : 'Nurse';

    return (
        <section className="overflow-x-auto font-poppins">
            <Welcome person={`${title}`} />

            {
                errorData ?
                    <h1>{errorData.error}</h1> :
                    user.role === 'doctor' ?
                        <>
                            <div className="grid grid-cols-1 gap-4 ss:grid-cols-2 mt-6">
                                {
                                    dashboardCardsInfo.map((data, index) => {

                                        return (
                                            <OverviewCard key={index} count={data.count} title={data.title} icon={data.icon} id={data.id} />
                                        )
                                    })
                                }
                            </div>

                            <div className="flex flex-col xl:flex-row gap-8 mt-10">
                                <div className="overflow-y-auto flex-1 bg-white rounded-lg shadow-sm">
                                    <h1 className="text-primary text-xl py-4 font-medium px-6 border-b-2 border-gray-200">Recent Scans</h1>
                                    <DashboardTable data={doctorData.recentScans} />
                                </div>
                            </div>
                        </> :
                        <>
                            <div className="mb-10">
                                <div className="flex justify-between items-center w-full mt-6">
                                    <h1 className="font-bold text-primary text-2xl leading-tight">Profile</h1>
                                    <div className="flex items-center gap-2">
                                        <Link to={`/user/profile/update`} state={{ user }} className="text-grey-lighter py-2 px-2 rounded-md bg-blue-600 hover:bg-blue-700">
                                            <MdOutlineEdit size={22} color='white' />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-10">
                                <div className="flex justify-center">
                                    {
                                        user.img ?
                                            <div className="w-40 h-40 border-primary border-2 rounded-full p-1">
                                                <img src={nurseData.img} className='rounded-full' alt={`${nurseData.firstName} ${nurseData.lastName}`} />
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
                                            {nurseData.user.id}
                                        </p>
                                    </div>
                                    <div className="">
                                        <h4 className="block text-base font-semibold text-[#07074D]">
                                            Email
                                        </h4>
                                        <p className="w-full text-base font-medium text-[#6B7280]">
                                            {nurseData.user.email}
                                        </p>
                                    </div>
                                    <div className="">
                                        <h4 className=" block text-base font-semibold text-[#07074D]">
                                            Role
                                        </h4>
                                        <p className="w-full text-base font-medium text-[#6B7280] capitalize">
                                            {nurseData.user.role}
                                        </p>
                                    </div>
                                    <div className="">
                                        <h4 className="block text-base font-semibold text-[#07074D]">
                                            First Name
                                        </h4>
                                        <p className="w-full text-base font-medium text-[#6B7280]">
                                            {nurseData.firstName}
                                        </p>
                                    </div>
                                    <div className="">
                                        <h4 className="block text-base font-semibold text-[#07074D]">
                                            Last Name
                                        </h4>
                                        <p className="w-full text-base font-medium text-[#6B7280]">
                                            {nurseData.lastName}
                                        </p>
                                    </div>
                                    <div className="">
                                        <h4 className=" block text-base font-semibold text-[#07074D]">
                                            Specialty
                                        </h4>
                                        <p className="w-full text-base font-medium text-[#6B7280]">
                                            {nurseData.specialty}
                                        </p>
                                    </div>
                                </fieldset>
                            </div>
                        </>

            }
        </section>
    )
}

export default UserDashboard;