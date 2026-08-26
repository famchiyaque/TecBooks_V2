import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography, Alert } from '@mui/material'
import GenericHeader from '@/components/global/GenericHeader'
import { useAuth } from '@/contexts/AuthContext'
import { loginRequest } from '@/api/auth.api'

const loginSchema = z.object({
  email: z.string().min(1, 'Rellena todos los campos').email('El formato del correo no es válido'),
  password: z.string().min(1, 'Rellena todos los campos'),
})

const ERROR_MESSAGES = {
  form_identifier_not_found: 'Favor de registrarte o contacta al administrador',
  user_banned: 'Cuenta desactivada, contacta al administrador',
  form_password_incorrect: 'Contraseña incorrecta',
}

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/home'

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = async ({ email, password }) => {
    try {
      const { user } = await loginRequest(email, password)
      login(user)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const code = err.response?.data?.error
      setError('root', { message: ERROR_MESSAGES[code] || 'No se pudo iniciar sesión, intenta de nuevo' })
    }
  }

  return (
    <>
      <GenericHeader pageName="Iniciar sesión" />
      <Box sx={{ maxWidth: 380, mx: 'auto', mt: '10vh', px: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#073a5a' }}>
          Iniciar sesión
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

          <TextField
            label="Correo"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Contraseña"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ bgcolor: '#073a5a' }}>
            Iniciar sesión
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default Login
