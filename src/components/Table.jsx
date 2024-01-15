import { useState, useEffect } from 'react';
import { createColumnHelper, getCoreRowModel, useReactTable, flexRender, getPaginationRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import SearchInput from './SearchInput';
import DownLoadBtn from './DownLoadBtn';
import { HiUserCircle } from 'react-icons/hi';
import UsersFilter from './UsersFilter';
import { useLocation } from 'react-router-dom';

const Table = ({ data: tableData, columns: cols, render }) => {
    const { pathname } = useLocation();
    const columnHelper = createColumnHelper();

    const columns = cols.map(col => {
        if (col.id === 'S/N') {
            return (
                columnHelper.accessor('', {
                    id: col.id,
                    cell: info => <span>{info.row.index + 1}</span>,
                    header: col.header
                })
            )
        }

        if (col.id === 'img') {
            return (
                columnHelper.accessor(col.id, {
                    id: col.id,
                    cell: info => {
                        return info.getValue() ?
                            <img src={info?.getValue()} className='rounded-full w-10 h-10 object-cover' alt="" /> :
                            <HiUserCircle className='rounded-full text-primary' size={40} />
                    },
                    header: col.header
                })
            )
        }

        if (col.id === 'dob') {
            return (
                columnHelper.accessor(col.id, {
                    id: col.id,
                    cell: info => new Date().getFullYear() - new Date(info.getValue()).getFullYear(),
                    header: col.header
                })
            )
        }

        if (col.id === 'createdAt') {
            return (
                columnHelper.accessor(col.id, {
                    id: col.id,
                    cell: info => new Date(info.getValue()).toDateString(),
                    header: col.header
                })
            )
        }

        if (col.id === 'active') {
            return (
                columnHelper.accessor(col.id, {
                    id: col.id,
                    cell: info => (
                        <span className={info.getValue() === true ? 'active-pill' : 'inactive-pill'}>
                            {info.getValue() === true ? 'Active' : 'Inactive'}
                        </span>
                    ),
                    header: col.header
                })
            )
        }

        if (col.id === 'patientId') {
            return (
                columnHelper.accessor('', {
                    id: col.id,
                    cell: props => (
                        <span>
                            {`${props.row.original.patient.firstName} ${props.row.original.patient.lastName}`}
                        </span>
                    ),
                    header: col.header
                })
            )
        }

        if (col.id === 'actions') {
            return (
                columnHelper.accessor('', {
                    id: col.id,
                    cell: props => (
                        render(props.row.original)
                    ),
                    header: col.header
                })
            )
        }

        return (
            columnHelper.accessor(col.id, {
                id: col.id,
                cell: info => <span>
                    {
                        info.getValue() ? info.getValue() : 'N/A'
                    }
                </span>,
                header: col.header
            })
        )
    });

    const [data] = useState(() => [...tableData]);
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    function generateMultiplesOf10(totalNumber) {
        let num = Math.ceil(totalNumber / 10);
        const multiplesOf10 = [];

        for (let i = 1; i <= num; i++) {
            multiplesOf10.push(i * 10);
        }
        return multiplesOf10;
    }

    return (
        <div className='flex flex-col w-full'>
            <div className="mt-6 mb-4 flex flex-col items-start gap-2 sm:gap-0 sm:flex-row sm:items-center sm:justify-between w-full">
                <SearchInput
                    value={globalFilter ?? ''}
                    onChange={(value) => setGlobalFilter(String(value))}
                />

                {pathname === '/admin/users' && <UsersFilter />}

                <DownLoadBtn data={tableData} fileName={'tableData.csv'}>Download data</DownLoadBtn>
            </div>

            <div className='overflow-auto'>
                <table className='min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700'>
                    <thead className='bg-gray-100 dark:bg-gray-700 w-full'>
                        {
                            table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {
                                        headerGroup.headers.map(header => (
                                            <th key={header.id} className="th">
                                                {
                                                    flexRender(header.column.columnDef.header, header.getContext())
                                                }
                                            </th>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </thead>

                    <tbody className="bg-white divide-y w-full divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {
                            table.getRowModel().rows.length > 0 ?
                                table.getRowModel().rows.map((row, i) => (
                                    <tr key={row.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {
                                            row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className="table-data">
                                                    {
                                                        flexRender(cell.column.columnDef.cell, cell.getContext())
                                                    }
                                                </td>
                                            ))
                                        }
                                    </tr>
                                )) :
                                <tr className='text-center h-32'>
                                    <td colSpan={12}>No record found!</td>
                                </tr>
                        }
                    </tbody>
                </table>
                {/* Pagination */}
                <div className="mt-6 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-700 dark:text-gray-100">
                            {
                                `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`
                            }
                        </span>

                        <span className='flex items-center gap-1'>
                            Go to page:
                            <input
                                type="number"
                                className='border border-primary p-1 rounded-sm w-10 bg-white'
                                defaultValue={table.getState().pagination.pageIndex + 1}
                                onChange={(e) => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                    table.setPageIndex(page);
                                }}
                            />
                        </span>

                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                table.setPageSize(Number(e.target.value));
                            }}
                            className='p-2 bg-transparent'
                        >
                            {
                                generateMultiplesOf10(tableData.length).map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
                        <button onClick={() => { table.previousPage() }} disabled={!table.getCanPreviousPage()} className="flex items-center justify-center w-1/2 px-5 py-2 text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 disabled:opacity-30 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                            <FaArrowLeftLong size={18} />
                            <span>
                                previous
                            </span>
                        </button>

                        <button onClick={() => { table.nextPage() }} disabled={!table.getCanNextPage()} className="flex items-center justify-center w-1/2 px-5 py-2 text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 disabled:opacity-30 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
                            <span>
                                Next
                            </span>
                            <FaArrowRightLong size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Table;