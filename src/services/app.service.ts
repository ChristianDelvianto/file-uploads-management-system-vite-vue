import axios from 'axios'

/**
 * Get Laravel CSRF Cookie
 * 
 * We are not using API here, because the request send to web route.
 */
export async function getCSRFCookie(): Promise<void> {
    await axios.get('/sanctum/csrf-cookie')
}
