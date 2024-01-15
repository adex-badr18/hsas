import { jwtDecode } from 'jwt-decode';
import { json } from "react-router-dom";
import { redirect } from 'react-router-dom';

// const user = JSON.parse(localStorage.getItem('user'));

export async function loginUser(creds) {
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/auth/login`,
        {
            method: 'post',
            body: JSON.stringify(creds),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    const resData = await res.json();

    if (!res.ok) {
        return {
            statusCode: resData.statusCode,
            message: resData.message,
            error: resData.error,
            path: resData.path
        }
    }

    // Decode token and get the payload
    const decodedToken = jwtDecode(JSON.stringify(resData.accessToken));

    const data = {
        ...resData,
        ...decodedToken
    }

    return data;

}

export async function getAdminDashboardData(request) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/users/admin/dashboard`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

// Admin Users API -------------------------

export async function createUser(userData) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (res.status === 401) {
        return {
            unAuthorize: true
        }
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function updateUser(userId, userData) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(userData)
    });

    const data = await res.json();

    if (res.status === 401) {
        return {
            unAuthorize: true
        }
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function getUsers(request) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function getUser(userId, request) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function activateUser(userId, request) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/users/activate/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (res.status === 401) {
        return {
            unAuthorize: true
        }
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function deactivateUser(userId) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/users/deactivate/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (res.status === 401) {
        return {
            unAuthorize: true
        }
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function deleteUser(userId) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/users/delete/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

// Patients API -----------------------

export async function createPatient(patientData) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/patients`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(patientData)
    });

    const data = await res.json();

    if (res.status === 401) {
        return {
            unAuthorize: true
        }
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function updatePatient(patientId, patientData) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/patients/${patientId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(patientData)
    });

    const data = await res.json();

    if (res.status === 401) {
        return {
            unAuthorize: true
        }
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function getPatients(request) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/patients`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function getPatient(patientId, request) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/patients/${patientId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function deletePatient(patientId) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/patients/delete/${patientId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

// Scans API -----------------------------

export async function createScan(scanData) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/scans`, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
        body: scanData
    });

    const data = await res.json();

    if (res.status === 401) {
        return {
            unAuthorize: true
        }
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function updateScan(scanId, scanData) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/scans/${scanId}`, {
        method: 'PATCH',
        headers: {
            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
        body: scanData
    });

    const data = await res.json();

    if (res.status === 401) {
        return {
            unAuthorize: true
        }
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function getScans(request) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/scans`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function getScan(scanId, request) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/scans/${scanId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function deleteScan(scanId) {
    const user = JSON.parse(localStorage.getItem('user'));
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/scans/delete/${scanId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }

    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

// Users Doctors
export async function getUserHomePageData(request) {
    const user = JSON.parse(localStorage.getItem('user'));
    let endpoint = '';

    if (user.role === 'doctor') {
        endpoint = '/doctors/dashboard';
    } 
    
    if (user.role === 'nurse') {
        endpoint = `/nurses/${user.userId}`;
    }
    
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (data.statusCode === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }

    if (!res.ok) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function getUserProfile(userId, request) {
    const user = JSON.parse(localStorage.getItem('user'));
    let entity = '';

    if (user.role === 'doctor') {
        entity = 'doctors';
    } else if (user.role === 'nurse') {
        entity = 'nurses'
    }

    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/${entity}/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
    });

    const data = await res.json();

    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }

    if (!res.ok) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function updateUserProfile(userId, profileData) {
    const user = JSON.parse(localStorage.getItem('user'));
    let entity = '';

    if (user.role === 'nurse') {
        entity = 'nurses';
    } else if (user.role === doctor) {
        entity = 'doctors'
    }

    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/${entity}/update-profile/${userId}`, {
        method: 'PATCH',
        headers: {
            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
        body: profileData
    });

    const data = await res.json();

    if (res.status === 401) {
        return {
            unAuthorize: true
        }
    }

    if (!res.ok) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}

export async function updateUserPassword(userId, passwordData) {
    const user = JSON.parse(localStorage.getItem('user'));
    let entity = '';

    if (user.role === 'nurse') {
        entity = 'nurses';
    } else if (user.role === doctor) {
        entity = 'doctors'
    }

    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/${entity}/update-password/${userId}`, {
        method: 'PATCH',
        headers: {
            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
        },
        body: passwordData
    });

    const data = await res.json();

    if (res.status === 401) {
        return {
            unAuthorize: true
        }
    }

    if (!res.ok) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }

    return data;
}