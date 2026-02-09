import axios, { AxiosError } from 'axios'

const Api = axios.create({
    // baseURL: '', // Base URL already defined from src/main.ts
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: false,
    withXSRFToken: false,
})

/**
 * Request interceptors
 */
Api.interceptors.request.use(
    (req) => {
        const token = localStorage.getItem('token')

        if (token) {
            req.headers['Authorization'] = `Bearer ${token}`
        }

        return req
    },
    (err) => {
        return Promise.reject(err)
    }
)

/**
 * Response interceptors
 */
Api.interceptors.response.use(
    (res) => res,
    async (originalErr: AxiosError): Promise<AxiosError> => {
        // We are using Laravel Sanctum
        // No need for refresh token logic
        
        return Promise.reject(originalErr)
    }
)

export default Api
