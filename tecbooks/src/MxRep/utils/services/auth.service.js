
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const authService = {
    async login(credentials) {
      return {
        user: {
          id: "user123",
          email: "jimmy@john.com",
          firstNames: "Jimmy John",
          lastNames: "The Second",
          role: "admin",
          aStatus: false,
          institution: {
            id: "institution123",
            name: "Hogwarts",
            slug: "hogwarts"
          },
          expiration: Date.now() / 1000 + 600
        },
        token: "token123456"
      }

      // const response = await fetch(`${API_BASE_URL}/mxrep/login`, {
      //   method: "POST",
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(credentials) // Fixed: body should be JSON string
      // })
  
      // if (!response.ok) {
      //   throw new Error(`Login failed: ${response.status} ${response.statusText}`)
      // }
  
      // const data = await response.json()
      // return data
    },
  
    async handleLoginResponse(data) {
      // Extract JWT and role from response
      const jwt = data.token
      const user = data.user
      const role = data.user?.role
      const slug = data.user?.institution?.slug
      
      if (jwt) {
        localStorage.setItem("tecbooks-token", jwt)
        localStorage.setItem("tecbooks-user", JSON.stringify(user))
        return { success: true, role, slug }
      }
      
      throw new Error('No token received')
    },

    async refreshToken(token, user) {
        const response = await fetch(`${API_BASE_URL}/mxrep/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user }),
        })
    
        if (!response.ok) throw new Error("Failed to refresh session")
    
        const data = await response.json()
        return data
    },
}
