import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPatient, updatePatient } from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PatientForm = () => {
    const { state, pathname } = useLocation();
    const navigate = useNavigate();
    const patient = state && state.currentPatient;
    const [formData, setFormData] = useState(patient ?
        {
            firstName: patient.firstName,
            lastName: patient.lastName,
            gender: patient.gender ?? '',
            phoneNumber: patient.phoneNumber,
            address: patient.address,
            dob: formatDate(new Date(patient.dob)),
            nextOfKinName: patient.nextOfKinName,
            nextOfKinPhone: patient.nextOfKinPhone,
            nextOfKinRelationship: patient.nextOfKinRelationship
        } :
        {
            firstName: '',
            lastName: '',
            gender: '',
            phoneNumber: '',
            address: '',
            dob: '',
            nextOfKinName: '',
            nextOfKinPhone: '',
            nextOfKinRelationship: ''
        }
    );

    function formatDate(originalDate) {
        // Get the year, month, and day
        const year = originalDate.getFullYear();
        const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const day = originalDate.getDate().toString().padStart(2, '0');

        // Create the formatted date string
        const formattedDateString = `${year}-${month}-${day}`;

        return formattedDateString;
    }

    function handleChange(e) {
        const { name, value, checked, type } = e.target;
        const elementValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: elementValue
        }))
    }

    async function submitForm(e) {
        e.preventDefault();

        const btnType = e.target.elements[10].dataset.intent;

        const patientData = {
            ...formData,
            dob: new Date(`${formData.dob} 00:00:00`).toISOString()
        }

        if (btnType === 'create') {
            try {
                const patientResponse = await createPatient(patientData);

                if (patientResponse.unAuthorize) {
                    // const pathname = location.pathname;
                    navigate(`/?message=Please log in to continue&redirectTo=${pathname}`);
                }

                if (patientResponse.error || patientResponse.message) {
                    toast.error(`${patientResponse.error} ${patientResponse.message}`, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    });

                    return {
                        error: patientResponse.error
                    }
                }

                toast.success(`Patient successfully created!`, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });

                setTimeout(() => {
                    navigate(`/user/patients`);
                }, 3000);
            } catch (error) {
                return error;
            }
        }

        if (btnType === 'update') {
            const patientResponse = await updatePatient(patient.id, patientData);

            if (patientResponse.unAuthorize) {
                const pathname = location.pathname;
                navigate(`/?message=Please log in to continue&redirectTo=${pathname}`);
            }

            if (patientResponse.error || patientResponse.message) {
                toast.error(`${patientResponse.error} ${patientResponse.message}`, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });

                return {
                    error: patientResponse.error
                }
            }

            toast.success(`Patient successfully updated!`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });

            setTimeout(() => {
                navigate(`/user/patients`);
            }, 3000);
        }
    }

    return (
        <div className="flex flex-col pt-6 font-poppins">
            <ToastContainer />
            <div className="pb-6">
                <nav aria-label="breadcrumb">
                    <ol className="flex space-x-2">
                        <li><Link to="/user" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Dashboard</Link></li>
                        <li><Link to="/user/patients" className="after:content-['>'] after:ml-2 text-gray-600 hover:text-purple-700 text-lg">Patients</Link></li>
                        <li className="text-purple-700 font-medium text-lg" aria-current="page">Patient Form</li>
                    </ol>
                </nav>

                <h1 className="font-bold text-primary text-2xl leading-tight mt-6">{state ? 'Update' : 'Create'} Patient</h1>
            </div>

            <div className="mx-auto w-full">
                <form onSubmit={submitForm}>
                    <div className="grid grid-cols-1 gap-6 xs:grid-cols-2">
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
                                placeholder="08064590912"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor='dob'
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dob"
                                id="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                placeholder="Date"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
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
                        <div className="">
                            <label
                                htmlFor="address"
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Address
                            </label>
                            <textarea
                                name="address"
                                id="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder='Address'
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md h-[56px]"></textarea>
                        </div>
                    </div>

                    <fieldset className='grid grid-cols-1 xs:grid-cols-2 gap-6 border-2 border-gray-300 rounded-md p-6 mb-4'>
                        <legend className='font-semibold text-primary px-1'>Next of Kin</legend>

                        <div className="">
                            <label
                                htmlFor="nextOfKinName"
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                name="nextOfKinName"
                                id="nextOfKinName"
                                value={formData.nextOfKinName}
                                onChange={handleChange}
                                placeholder="Name"
                                className="w-full rounded-s-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor="nextOfKinRelationship"
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Relationship
                            </label>
                            <input
                                type="text"
                                name="nextOfKinRelationship"
                                id="nextOfKinRelationship"
                                value={formData.nextOfKinRelationship}
                                onChange={handleChange}
                                placeholder="Relationship"
                                className="w-full rounded-s-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                        <div className="">
                            <label
                                htmlFor="nextOfKinPhone"
                                className="mb-1 block text-base font-medium text-[#07074D]"
                            >
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="nextOfKinPhone"
                                id="nextOfKinPhone"
                                value={formData.nextOfKinPhone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="w-full rounded-s-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                    </fieldset>

                    <div className='flex justify-end'>
                        {
                            state ?
                                <button type='submit' data-intent='update' className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">Update Patient</button> :
                                <button type='submit' data-intent='create' className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">Create Patient</button>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PatientForm;