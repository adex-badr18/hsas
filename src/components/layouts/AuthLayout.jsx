import { Outlet, Navigate, useLocation } from 'react-router-dom';

const AuthLayout = () => {
    const location = useLocation();
    const authenticated = localStorage.getItem('user') || false;

    if (authenticated) {
        return <Outlet />
    }

    return <Navigate to='/' state={{ message: 'Please login to continue', from: location.pathname }} />
}

export default AuthLayout;