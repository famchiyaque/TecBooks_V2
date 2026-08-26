import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Button, TextField, Typography, Alert, Link as MuiLink } from '@mui/material'
import { useSignIn } from '@clerk/react'
import GenericHeader from '@/components/global/GenericHeader'
import { useAuth } from '@/contexts/AuthContext'
import { loginRequest, registerRequest } from '@/api/auth.api'
import './Login.css'

const signInSchema = z.object({
  email: z.string().min(1, 'Please fill in all fields').email('Invalid email format'),
  password: z.string().min(1, 'Please fill in all fields'),
})

const signUpSchema = z.object({
  firstName: z.string().min(1, 'Please fill in all fields'),
  lastName: z.string().min(1, 'Please fill in all fields'),
  email: z.string().min(1, 'Please fill in all fields').email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

const SIGN_IN_ERROR_MESSAGES = {
  form_identifier_not_found: 'Please sign up or contact the administrator',
  user_banned: 'Account deactivated, contact the administrator',
  form_password_incorrect: 'Incorrect password',
}

const SIGN_UP_ERROR_MESSAGES = {
  email_already_registered: 'An account with this email already exists',
  weak_password: 'Password is too weak, please choose a stronger one',
}

function useCompleteAuth(redirectTo) {
  const { login } = useAuth()
  const { isLoaded: clerkLoaded, signIn, setActive } = useSignIn()
  const navigate = useNavigate()

  return async ({ user, clerkTicket }) => {
    if (clerkTicket && clerkLoaded) {
      const result = await signIn.create({ strategy: 'ticket', ticket: clerkTicket })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
      }
    }

    login(user)
    navigate(redirectTo, { replace: true })
  }
}

function SignInForm({ onSwitch, redirectTo }) {
  const completeAuth = useCompleteAuth(redirectTo)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signInSchema) })

  const onSubmit = async ({ email, password }) => {
    try {
      const { user, clerkTicket } = await loginRequest(email, password)
      await completeAuth({ user, clerkTicket })
    } catch (err) {
      const code = err.response?.data?.error
      setError('root', { message: SIGN_IN_ERROR_MESSAGES[code] || 'Unable to sign in, please try again' })
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form-inner">
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#073a5a' }}>
        Sign In
      </Typography>

      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

      <TextField
        label="Email"
        type="email"
        size="small"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Password"
        type="password"
        size="small"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ bgcolor: '#073a5a', borderRadius: 999, py: 1, mt: 1 }}>
        Sign In
      </Button>

      <MuiLink component="button" type="button" onClick={onSwitch} underline="hover" sx={{ display: { xs: 'block', sm: 'none' }, mt: 1 }}>
        Don't have an account? Sign Up
      </MuiLink>
    </Box>
  )
}

function SignUpForm({ onSwitch, redirectTo }) {
  const completeAuth = useCompleteAuth(redirectTo)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signUpSchema) })

  const onSubmit = async ({ firstName, lastName, email, password }) => {
    try {
      const { user, clerkTicket } = await registerRequest({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      })
      await completeAuth({ user, clerkTicket })
    } catch (err) {
      const code = err.response?.data?.error
      setError('root', { message: SIGN_UP_ERROR_MESSAGES[code] || 'Unable to create account, please try again' })
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form-inner">
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#073a5a' }}>
        Create Account
      </Typography>

      {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

      <TextField
        label="First Name"
        size="small"
        {...register('firstName')}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />

      <TextField
        label="Last Name"
        size="small"
        {...register('lastName')}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />

      <TextField
        label="Email"
        type="email"
        size="small"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Password"
        type="password"
        size="small"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message || 'At least 8 characters'}
      />

      <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ bgcolor: '#073a5a', borderRadius: 999, py: 1, mt: 1 }}>
        Sign Up
      </Button>

      <MuiLink component="button" type="button" onClick={onSwitch} underline="hover" sx={{ display: { xs: 'block', sm: 'none' }, mt: 1 }}>
        Already have an account? Sign In
      </MuiLink>
    </Box>
  )
}

function Login() {
  const location = useLocation()
  const redirectTo = location.state?.from || '/home'
  const [rightPanelActive, setRightPanelActive] = React.useState(false)

  return (
    <>
      <GenericHeader pageName="Sign In" />
      <Box className="auth-wrapper">
        <Box className={`auth-container${rightPanelActive ? ' right-panel-active' : ''}`}>
          <Box className="auth-form-container auth-sign-up-container">
            <SignUpForm onSwitch={() => setRightPanelActive(false)} redirectTo={redirectTo} />
          </Box>

          <Box className="auth-form-container auth-sign-in-container">
            <SignInForm onSwitch={() => setRightPanelActive(true)} redirectTo={redirectTo} />
          </Box>

          <Box className="auth-overlay-container">
            <Box className="auth-overlay">
              <Box className="auth-overlay-panel auth-overlay-left">
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Welcome Back!
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Already have an account? Sign in to keep exploring your projects.
                </Typography>
                <Button variant="outlined" className="auth-ghost-btn" onClick={() => setRightPanelActive(false)}>
                  Sign In
                </Button>
              </Box>

              <Box className="auth-overlay-panel auth-overlay-right">
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Hello, Friend!
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Don't have an account yet? Sign up and start your project feasibility simulation.
                </Typography>
                <Button variant="outlined" className="auth-ghost-btn" onClick={() => setRightPanelActive(true)}>
                  Sign Up
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Login
