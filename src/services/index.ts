import axios from 'axios'

const Api = axios.create({
    // Base URL already defined from src/main.ts
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    withXSRFToken: true
})

/**
 * Since we are using cookie-based authentication,
 * no need to configure axios interceptors.
 */

export default Api
