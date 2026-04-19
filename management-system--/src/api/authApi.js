const BASE_URL = 'http://localhost:5001/api/auth';

async function handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data;
}

//signin
export async function signInApi(formData) {
    const response = await fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });
    return handleResponse(response);
}

//signup
export async function signUpApi(formData) {
    const response = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });
    return handleResponse(response);
}

//update-password
export async function updatePasswordApi(formData) {
    const response = await fetch(`${BASE_URL}/update-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });
    return handleResponse(response);
}

//logout
export async function logOutApi() {
    const response = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return handleResponse(response);
}