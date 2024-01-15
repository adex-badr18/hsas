import { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createScan, updateScan } from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ScanForm = () => {
    const { state, pathname } = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const scan = state && state.currentScan;
    const fileRef = useRef(null);
    const [selectedScan, setSelectedScan] = useState(null);
    const [formData, setFormData] = useState(scan ?
        {
            patientId: scan.patientId,
            doctorId: scan.doctorId,
            type: scan.type,
            symptoms: scan.symptoms,
            diagnosis: scan.diagnosis
        }
        :
        {
            patientId: '',
            doctorId: '',
            type: '',
            symptoms: '',
            diagnosis: '',
            file: selectedScan
        }
    );

    async function submitForm(e) {
        e.preventDefault();

        const btnType = state ? e.target.elements[5].dataset.intent : e.target.elements[7].dataset.intent;
        const scanData = new FormData();

        scanData.append('patientId', String(formData.patientId));
        scanData.append('doctorId', String(formData.doctorId));
        scanData.append('type', formData.type);
        scanData.append('symptoms', formData.symptoms);
        scanData.append('diagnosis', formData.diagnosis);
        scanData.append('file', selectedScan ? selectedScan : '');

        if (btnType === 'create') {
            try {
                const scanResponse = await createScan(scanData);

                if (scanResponse.unAuthorize) {
                    navigate(`/?message=Please log in to continue&redirectTo=${pathname}`);
                }

                if (scanResponse.error || scanResponse.message) {
                    toast.error(`${scanResponse.error} ${scanResponse.message}`, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    });

                    return {
                        error: scanResponse.error
                    }
                }

                toast.success(`Scan successfully created!`, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });

                setTimeout(() => {
                    navigate(`/user/scans`);
                }, 3000);
            } catch (error) {
                return error;
            }
        }

        if (btnType === 'update') {
            scanData.delete('file');

            try {
                const scanResponse = await updateScan(scan.id, formData);

                if (scanResponse.unAuthorize) {
                    navigate(`/?message=Please log in to continue&redirectTo=${pathname}`);
                }

                if (scanResponse.error || scanResponse.message) {
                    toast.error(`${scanResponse.error} ${scanResponse.message}`, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    });

                    return {
                        error: scanResponse.error
                    }
                }

                toast.success(`Scan successfully updated!`, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });

                setTimeout(() => {
                    navigate(`/user/scans`);
                }, 3000);
            } catch (error) {
                return error;
            }
        }
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        const elementValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: elementValue
        }));
    }

    function browseScan(e) {
        e.preventDefault();

        fileRef.current?.click();
    }

    function handleScanSelect(e) {
        e.preventDefault();

        const file = e.target.files[0];

        if (file) {
            setSelectedScan(file);
        }
    }

    return (
        <div className="flex flex-col pt-6 font-poppins">
            <ToastContainer />
            <div className="pb-6">
                <nav aria-label="breadcrumb">
                    <ol className="flex space-x-2">
                        <li><Link to="/user" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Home</Link></li>
                        <li><Link to="/user/scans" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Scans</Link></li>
                        <li className="text-purple-700 font-medium text-lg" aria-current="page">Scan Form</li>
                    </ol>
                </nav>

                <h1 className="font-bold text-primary text-2xl leading-tight mt-6">{state ? 'Update' : 'Upload'} Scan</h1>
            </div>

            <div className="mx-auto w-full">
                <form onSubmit={submitForm}>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-6">
                        <div className="">
                            <label
                                htmlFor='patientId'
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Patient ID
                            </label>
                            <input
                                type="text"
                                name="patientId"
                                id="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                placeholder="Patient ID"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        {
                            user.role === 'nurse' &&
                            <div className="">
                                <label
                                    htmlFor="doctorId"
                                    className="mb-1 block text-base font-medium text-[#07074D]"
                                >
                                    Doctor ID
                                </label>
                                <input
                                    type="text"
                                    name="doctorId"
                                    id="doctorId"
                                    value={formData.doctorId}
                                    onChange={handleChange}
                                    placeholder="Doctor ID"
                                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                />
                            </div>
                        }
                        <div className="">
                            <label
                                htmlFor="type"
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Scan Type
                            </label>
                            <input
                                type="text"
                                name="type"
                                id="type"
                                value={formData.type}
                                onChange={handleChange}
                                placeholder="Scan Type"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor='symptoms'
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Symptoms
                            </label>
                            <input
                                type="text"
                                name="symptoms"
                                id="symptoms"
                                value={formData.symptoms}
                                onChange={handleChange}
                                placeholder="Symptoms"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor='diagnosis'
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Diagnosis
                            </label>
                            <input
                                type="text"
                                name="diagnosis"
                                id="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleChange}
                                placeholder="Diagnosis"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        {
                            !state &&
                            <div className="self-end">
                                <label
                                    htmlFor="file"
                                    className="mb-1 block text-base font-medium text-[#07074D] sr-only"
                                >
                                    Scan <small>Compressed files only (.zip)</small>
                                </label>
                                <input
                                    type="file"
                                    name="file"
                                    id="file"
                                    ref={fileRef}
                                    onChange={handleScanSelect}
                                    placeholder="Next of Kin"
                                    className="w-full rounded-s-md h-[50px] border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md hidden"
                                />
                                <div className="flex items-end gap-4">
                                    <button onClick={browseScan} className="hover:shadow-form rounded-md bg-[#6A64F1] hover:bg-[#5f58f1] py-3 px-8 text-center text-base font-semibold text-white outline-none">{selectedScan ? 'Change Scan' : 'Browse Scan'}</button>
                                    <p className="font-poppins font-medium text-lg">{selectedScan ? selectedScan.name : 'No file chosen'}</p>
                                </div>
                            </div>
                        }
                    </div>

                    <div className='flex justify-end mt-3'>
                        {
                            state ?
                                <button type='submit' data-intent='update' className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">Update Scan</button>
                                :
                                <button type='submit' data-intent='create' className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">Upload Scan</button>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ScanForm;