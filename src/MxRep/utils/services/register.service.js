const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const registerService = {
    async registerInstitution(data) {
    //   return {
    //     user: mockUser,
    //     token : generateMockToken()
    //   }
      console.log("Data being sent: ", data)

      const response = await fetch(`${API_BASE_URL}/mxrep/register/institution/request`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to submit institution request: ${response.status} ${response.error}`)
      }

      const message = await response.json()
      console.log("Response: ", message)
    //   return data
    },
}
