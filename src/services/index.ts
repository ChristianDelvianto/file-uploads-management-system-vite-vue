import { TOKEN_KEY } from '@/const/localStorage'
import axios, { AxiosError } from 'axios'

const Api = axios.create({
    // baseURL: '', // Base URL already defined from src/main.ts
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: false,
    withXSRFToken: false
})

/**
 * Request interceptors
 */
Api.interceptors.request.use(
    (req) => {
        const token = localStorage.getItem(TOKEN_KEY)

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
    async (originalErr: AxiosError): Promise<never> => {
        // No need for refresh token logic, we are using Laravel Sanctum
        // (Unless we set token expiration from the backend)
        
        return Promise.reject(originalErr)
    }
)

export default Api
