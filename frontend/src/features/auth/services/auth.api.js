import axios from 'axios';

const api = axios.create({
    baseURL: 'https://nexa-ai-odre.vercel.app',
    withCredentials: true 
})

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', { username, email, password });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post('/api/auth/login', { email, password });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function getMe() {
    try {
        const response = await api.get('/api/auth/get-me');
        return response.data;
    } catch (error) {
        console.error('Get user error:', error);
        throw error;
    }
}