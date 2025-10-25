
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// utils/mockToken.js
export function generateMockToken(userId = "user123", email = "jimmy@john.com", role = "admin") {
  const header = {
    alg: "HS256",
    typ: "JWT"
  }

  const payload = {
    userId,
    email,
    role,
    exp: Math.floor(Date.now() / 1000) + 600 // 1 hour from now
  }

  // helper to Base64URL-encode an object
  const encode = (obj) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")

  const encodedHeader = encode(header)
  const encodedPayload = encode(payload)
  const signature = "mockSignature12345"

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

const mockUser = {
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
  }
}


export const authService = {
    async login(credentials) {
      return {
        user: mockUser,
        token : generateMockToken()
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
