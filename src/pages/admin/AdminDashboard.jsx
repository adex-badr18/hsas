import Welcome from '../../components/Welcome';
import OverviewCard from "../../components/OverviewCard";
import DashboardTable from "../../components/DashboardTable";
import { FaUserDoctor, FaUserInjured, FaFileMedical, FaStethoscope, FaUserNurse } from "react-icons/fa6";
import { dashboardCardsInfo, scans, users } from '../../constants';
import { Link, useLoaderData } from "react-router-dom";
import { EmptySearch } from '../../components/EmptySearch';
import { requireAuth } from '../../utils';
import { getAdminDashboardData } from '../../api';
import { HiUserCircle } from 'react-icons/hi';

export async function loader({ request }) {
    await requireAuth(request);
    const data = await getAdminDashboardData(request);

    if (data.message || data.error) {
        return {
            error: data.error ?? data.message
        };
    }

    const dashboardCardsInfo = [
        { id: 'doctors', title: 'Total Doctors', count: data.doctorsCount, icon: <FaUserDoctor size={20} /> },
        { id: 'patients', title: 'Total Patients', count: data.patientsCount, icon: <FaUserInjured size={20} /> },
        { id: 'nurses', title: 'Total Nurses', count: data.nursesCount, icon: <FaUserNurse size={20} /> },
        { id: 'scans', title: 'Total Scans', count: data.scansCount, icon: <FaFileMedical size={20} /> },
    ];

    return [dashboardCardsInfo, data.recentScans, data.recentUsers];
}

const AdminDashboard = () => {
    const [cardsData, scansData, recentUsers] = useLoaderData();

    return (
        <section className="overflow-x-auto font-poppins">
            <Welcome person='Admin' />

            <div className="grid grid-cols-1 gap-4 ss:grid-cols-2 lg:grid-cols-4 mt-6">
                {
                    cardsData.map((data, index) => {

                        return (
                            <OverviewCard key={data.id} count={data.count} title={data.title} icon={data.icon} id={data.id} />
                        )
                    })
                }
            </div>

            <div className="flex flex-col xl:flex-row gap-8 mt-10">
                <div className="overflow-y-auto flex-1 bg-white rounded-lg shadow-sm">
                    <h1 className="text-primary text-xl py-4 font-medium px-6 border-b-2 border-gray-200">Recent Scans</h1>
                    <DashboardTable data={scansData} />
                </div>

                <div className="flex flex-col flex-1 bg-white pb-4 shadow-xl rounded-md max-w-[440px]">
                    <h1 className="text-primary text-xl py-4 font-medium px-6 border-b-2 border-gray-200">Recent Users</h1>

                    <ul className="list-none">
                        {
                            recentUsers.length === 0 ?
                                <EmptySearch headers={[]} type='users' />
                                :
                                recentUsers.map(user => {
                                    const title = user.role === 'doctor' ? 'Dr. ' : '';
                                    return (
                                        <li key={user.id} className="py-3 px-6">
                                            <Link to={`users/${user.id}`} className="flex items-center gap-4">
                                                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-blue-100">
                                                    {
                                                        user.img ?
                                                            <img src={user.img} className='rounded-full' alt={`${title}${user.firstName} ${user.lastName}`} /> :
                                                            <HiUserCircle className='text-primary' size={60} />
                                                    }

                                                </div>
                                                <div className="flex flex-col">
                                                    <h1 className="text-base font-medium text-primary">
                                                        {
                                                            user.firstName || user.lastName ?
                                                            `${title} ${user.firstName ?? ''} ${user.lastName ?? ''}` :
                                                            user.email
                                                        }
                                                    </h1>
                                                    <p className="text-sm text-gray-800 capitalize">{user.role}</p>
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                })
                        }
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default AdminDashboard;