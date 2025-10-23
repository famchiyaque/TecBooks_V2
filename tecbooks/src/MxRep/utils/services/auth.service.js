
export const authService = {
    async signIn(credentials) {
      const response = await fetch('http://localhost:3000/tecbooks/mxrep/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials) // Fixed: body should be JSON string
      })
  
      if (!response.ok) {
        throw new Error(`Login failed: ${response.status} ${response.statusText}`)
      }
  
      const data = await response.json()
      return data
    },
  
    async handleSignInResponse(data) {
      // Extract JWT and role from response
      const jwt = data.token // Adjust based on your API response structure
      const role = data.user?.role // Adjust based on your API response structure
      
      if (jwt) {
        localStorage.setItem("tecbooks-jwt", jwt)
        return { success: true, role }
      }
      
      throw new Error('No token received')
    }
  }