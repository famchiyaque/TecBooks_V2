/**
 * Fetches data from the API with authentication and ngrok support
 * @param {string} url - The API endpoint URL
 * @param {string} token - The authentication token
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} - The parsed JSON response
 */
export default async function fetchWithAuth(url, token, options = {}) {
    const {
        method = 'GET',
        body,
        headers: customHeaders = {},
        ...restOptions
    } = options

    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        ...customHeaders,
    }

    const fetchOptions = {
        method,
        headers,
        ...restOptions,
    }

    // Only include body if it's provided and method is not GET
    if (body && method !== 'GET') {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    const response = await fetch(url, fetchOptions)
    
    if (!response.ok) {
        // Handle 403 Forbidden - token expired or invalid
        // if (response.status === 403) {
        //     window.location.href = '/login'
        //     throw new Error('Session expired. Please login again.')
        // }
        
        // Try to get error message from response body
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
        } catch {
            // If response is not JSON, use default error message
        }
        throw new Error(errorMessage)
    }

    return response.json()
}