import React from 'react';
import { RxDashboard } from "react-icons/rx";
import { FaUserDoctor, FaUserInjured, FaFileMedical } from "react-icons/fa6";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaRegHospital } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const SideNav = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();

    function signOut() {
        localStorage.removeItem('user');
        navigate('/');
    }

    return (
        <div className="flex h-full w-full flex-col bg-[#14141E] py-4 md:px-2">
            <div
                className='flex flex-row justify-start items-center leading-none text-white'
            >
                <div className="navbar p-6">
                    <Link className="flex items-center justify-start gap-1"
                        to="/admin">
                        <FaRegHospital size={30} color='white' />
                        <span className="text-white font-poppins text-xl font-bold">HSAS</span>
                    </Link>
                </div>
            </div>

            <div className="flex grow flex-row justify-between items-center space-x-2 md:flex-col md:items-start md:justify-start px-6  md:space-y-2 mt-6 md:mt-[51px]">
                <Link
                    to='/admin'
                    className={clsx(
                        `flex h-[48px] grow items-center justify-center gap-2 p-3 text-xl rounded-lg md:text-base text-[#9A99A0] hover:bg-[#21212B] md:hover:border-t-2 md:hover:border-blue-600 hover:text-white md:w-full md:ml-2 md:flex-none md:justify-start md:p-2 md:px-3`,
                        {
                            'bg-[#21212B] text-white md:rounded-lg md:border-t-2 md:border-blue-600 hover:text-white': pathname === '/admin'
                        }
                    )}
                >
                    <RxDashboard size={18} />
                    <p className={clsx(`hidden md:block`, { 'text-white': pathname === '/admin' })}>Dashboard</p>
                </Link>

                <Link
                    to='/admin/users'
                    className={clsx(
                        `flex h-[48px] grow items-center justify-center gap-2 rounded-lg p-3 bg-[#21212B] md:bg-transparent text-xl md:text-base text-[#9A99A0] hover:bg-[#21212B] md:hover:rounded-lg md:hover:border-t-2 md:hover:border-blue-600 hover:text-white md:w-full md:flex-none md:justify-start md:p-2 md:px-3`,
                        {
                            'bg-sky-100 text-blue-600': pathname.includes('/admin/users')
                        }
                    )}
                >
                    <FaUserDoctor size={18} />
                    <p className={clsx(`hidden md:block`, { 'text-white': pathname.includes('/admin/users') })}>Users</p>
                </Link>

                <Link
                    to='/admin/patients'
                    className={clsx(
                        `flex h-[48px] grow items-center justify-center gap-2 rounded-lg p-3 bg-[#21212B] md:bg-transparent md:text-base text-[#9A99A0] hover:bg-[#21212B] md:hover:border-t-2 md:hover:border-blue-600 hover:text-white md:w-full md:flex-none md:justify-start md:p-2 md:px-3`,
                        {
                            'bg-sky-100 text-blue-600': pathname.includes('/admin/patients')
                        }
                    )}
                >
                    <FaUserInjured size={18} />
                    <p className={clsx(`hidden md:block`, { 'text-white': pathname.includes('/admin/patients') })}>Patients</p>
                </Link>

                <Link
                    to='/admin/scans'
                    className={clsx(
                        `flex h-[48px] grow items-center justify-center gap-2 rounded-lg p-3 bg-[#21212B] md:bg-transparent md:text-base text-[#9A99A0] hover:bg-[#21212B] md:hover:border-t-2 md:hover:border-blue-600 hover:text-white md:w-full md:flex-none md:justify-start md:p-2 md:px-3`,
                        {
                            'bg-sky-100 text-blue-600': pathname.includes('/admin/scans')
                        }
                    )}
                >
                    <FaFileMedical size={18} />
                    <p className={clsx(`hidden md:block`, { 'text-white': pathname.includes('/admin/scans') })}>Scans</p>
                </Link>

                <button onClick={() => signOut()} className="flex h-[48px] grow items-center justify-center gap-2 rounded-lg bg-red-600 text-white md:bg-transparent md:text-base md:text-[#9A99A0] hover:bg-[#21212B] md:hover:rounded-lg md:hover:border-t-2 md:hover:border-red-600 hover:text-white md:w-full md:flex-none md:justify-start md:p-2 md:px-3 mt-auto">
                    <RiLogoutCircleRLine size={18} />
                    <p className="hidden md:block">Logout</p>
                </button>
            </div>
        </div>
    )
}

export default SideNav;