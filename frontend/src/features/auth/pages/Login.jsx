import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Alert, AlertDescription } from '../../../components/ui'
import { Input } from '../../../components/ui'
import { Button } from '../../../components/ui'
import { Label } from '../../../components/ui'
import { PasswordInput } from '../../../components/ui'
import { useAuth } from '../hook/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { setError } from '../auth.slice'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { handleLogin } = useAuth()
  const { error } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)


  useEffect(() => {
    // Clear error when user is navigating away
    return () => {
      dispatch(setError(null))
    }
  }, [dispatch])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
    // Clear global error when user starts typing
    if (error) {
      dispatch(setError(null))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Validate form
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    try {
      await handleLogin({
        email: formData.email,
        password: formData.password,
      })
      // Navigate to home page after successful login
      setTimeout(() => {
        navigate('/')
      }, 500)
    } catch (error) {
      // Set error message from API response
      if (error.response && error.response.data && error.response.data.message) {
        dispatch(setError(error.response.data.message))
      } else {
        dispatch(setError('An unexpected error occurred. Please try again.'))
      }
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className='min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8 sm:px-6 md:px-8 dark'>
      <div className='w-full max-w-md'>
        {/* Background gradient decoration */}
        <div className='absolute inset-0 bg-linear-to-r from-[#60A6AF]/10 to-cyan-500/10 rounded-3xl blur-3xl -z-10' />

        <div className='page-transition relative bg-slate-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 md:p-8'>
          {/* Header */}
          <div className='mb-6 sm:mb-8 text-center'>
            <h1 className='text-2xl sm:text-3xl font-bold bg-linear-to-r from-[#60A6AF] to-cyan-400 bg-clip-text text-transparent mb-2'>
              Welcome Back
            </h1>
            <p className='text-slate-400 text-xs sm:text-sm'>Sign in to your account</p>
          </div>

          {/* Success Message */}
          {error && (
            <Alert variant='destructive' className='mb-4 sm:mb-6 border-red-500/50 bg-red-50/10'>
              <AlertDescription className='text-red-400 text-xs sm:text-sm'>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-5'>
            {/* Email Field */}
            <div className='space-y-1.5 sm:space-y-2'>
              <Label htmlFor='email' className='text-slate-300 text-xs sm:text-sm'>
                Email Address
              </Label>
              <Input
                id='email'
                type='email'
                name='email'
                placeholder='Enter your email'
                value={formData.email}
                onChange={handleChange}
                disabled={submitting}
                className={`text-xs sm:text-sm h-10 sm:h-11 ${errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              />
              {errors.email && (
                <Alert variant='destructive' className='mt-1.5 sm:mt-2'>
                  <AlertDescription className='text-red-400 text-xs'>
                    {errors.email}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Password Field */}
            <div className='space-y-1.5 sm:space-y-2'>
              <Label htmlFor='password' className='text-slate-200 text-xs sm:text-sm'>
                Password
              </Label>
              <PasswordInput
                id='password'
                name='password'
                placeholder='Enter your password'
                value={formData.password}
                onChange={handleChange}
                disabled={submitting}
                className={`text-xs sm:text-sm h-10 sm:h-11 ${errors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              />
              {errors.password && (
                <Alert variant='destructive' className='mt-1.5 sm:mt-2'>
                  <AlertDescription className='text-red-400 text-xs'>
                    {errors.password}
                  </AlertDescription>
                </Alert>
              )}
            </div>

          {/* General Error */}
          {errors.submit && (
            <Alert variant='destructive'>
              <AlertDescription className='text-red-400 text-xs sm:text-sm'>
                {errors.submit}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={submitting}
            className='w-full h-10 sm:h-11 text-xs sm:text-base font-semibold rounded-lg cursor-pointer'
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
          </form>

          {/* Footer */}
          <div className='mt-4 sm:mt-6 text-center text-xs sm:text-sm text-slate-400'>
            Don't have an account?{' '}
            <button
              type='button'
              onClick={() => navigate('/register')}
              className='text-[#60A6AF] hover:text-cyan-400 font-medium transition-colors cursor-pointer border-none bg-none p-0'
            >
             Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login