import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PageNotFound() {
    const [user, setUser] = useState(null);
    let url = '';

    if (!user) {
        url = '/';
    }

    if (user?.role === 'admin') {
        url = '/admin';
    }

    if (user?.role === 'doctor' || user?.role === 'nurse') {
        url = '/user';
    }

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user')));
    }, []);
    
    return (
        <section className="flex px-10 flex-col justify-center items-center gap-6 min-h-[73vh] w-full sm:w-4/5 md:w-1/2 font-poppins mx-auto">
            <h1 className="text-4xl font-bold text-primary text-center">404 | Page Not Found</h1>
            <p className="text-lg font-medium text-primary text-center">Sorry, the page you were looking for does not exist.</p>
            <Link to={url} className="w-full py-3 bg-primary rounded-md font-bold text-lg text-center text-dimWhite">Return to Home</Link>
        </section>
    )
}