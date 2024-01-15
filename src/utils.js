import { redirect } from "react-router-dom";

export async function requireAuth(request) {
    const isLoggedIn = JSON.parse(localStorage.getItem('user')) || false;
    const pathname = new URL(request.url).pathname;

    if (!isLoggedIn) {
        throw redirect(`/?message=Please login to continue&redirectTo=${pathname}`);
    }
}