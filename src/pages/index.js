// Pages
export { default as Home } from './Home';
export { default as Error } from './Error';
export { default as PageNotFound } from './PageNotFound';
export { default as AdminPasswordUpdate } from './admin/PasswordUpdate';
export { default as AdminDashboard } from './admin/AdminDashboard';
export { default as UsersList } from './admin/UsersList';
export { default as UserView } from './admin/UserView';
export { default as UserForm } from './admin/UserForm';
export { default as PatientsList } from './admin/PatientsList';
export { default as PatientView } from './admin/PatientView';
export { default as PatientForm } from './admin/PatientForm';
export { default as ScansList } from './admin/ScansList';
export { default as ScanView } from './admin/ScanView';
export { default as ScanForm } from './admin/ScanForm';

export { default as PasswordUpdate } from './user/PasswordUpdate';
export { default as UserDashboard } from './user/UserDashboard';
export { default as UserPatientForm } from './user/PatientForm';
export { default as UserPatientsList } from './user/PatientsList';
export { default as UserPatientView } from './user/PatientView';
export { default as UserScansList } from './user/ScansList';
export { default as UserScanView } from './user/ScanView';
export { default as UserScanForm } from './user/ScanForm';
export { default as UserProfileView } from './user/UserView';
export { default as UserProfileForm } from './user/UserForm';

// Admin Loaders
export { loader as loginLoader } from './Home';
export { loader as adminDashboardLoader } from './admin/AdminDashboard';
export { loader as usersListLoader } from './admin/UsersList';
export { loader as userViewLoader } from './admin/UserView';
export { loader as patientsListLoader } from './admin/PatientsList';
export { loader as patientViewLoader } from './admin/PatientView';
export { loader as scanViewLoader } from './admin/ScanView';
export { loader as scansListLoader } from './admin/ScansList';

// User Loaders
export { loader as userDashboardLoader } from './user/UserDashboard';
export { loader as userPatientsListLoader } from './user/PatientsList';
export { loader as userPatientViewLoader } from './user/PatientView';
export { loader as userScansListLoader } from './user/ScansList';
export { loader as userScanViewLoader } from './user/ScanView';
export { loader as userProfileUpdateLoader } from './user/UserForm';
export { loader as userProfileViewLoader } from './user/UserView';

// Actions
export { action as loginAction } from './Home';
export { action as userCreateAction } from './admin/UserForm';