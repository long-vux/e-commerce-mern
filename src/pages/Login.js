import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const apiUrl = process.env.REACT_APP_API_URL
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const user = sessionStorage.getItem('user')
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleLoginSuccess = async (response) => {
    const token = response.credential
    try {
      const response = await axios.post(apiUrl + 'api/auth/googleLogin', { token })
      const newToken = JSON.stringify(response.data.token)
      const decodedToken = jwtDecode(newToken)
      sessionStorage.setItem('user', JSON.stringify(decodedToken))
      toast.success('Login successful')
      navigate('/')
    } catch (error) {
      console.log(error)
      toast.error('Login failed')
    }
  };

  const handleLoginFailure = (error) => {
    console.log(error)
    toast.error('Login failed')
  };

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const response = await axios.post(
        apiUrl + 'api/auth/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.status === 200) {
        sessionStorage.setItem('user', JSON.stringify(response.data))
        setTimeout(() => {
          sessionStorage.removeItem('user')
          toast.info('Session expired. Please log in again.')
          navigate('/login') // Redirect to login page after session expires
        }, 24 * 60 * 60 * 1000) // 20 seconds in milliseconds
        navigate('/')
        toast.success('Login successful')
      }
    } catch (error) {
      if (error.response.status === 401) {
        setError(error.response.data)
      } else {
        setError(error.response.data.errors.Email[0] || error.response.data.errors.Password[0])
      }
      console.error('Error:', error.response)
    }
  }

  return (
    <div className='flex flex-row justify-around gap-20 items-center h-[600px]'>
      <div className='w-2/5'>
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className='flex flex-col p-4 rounded-lg ml-20 border border-1 border-gray-300 mb-2'
        >
          <h1 className='text-2xl font-bold mb-4'>Log in</h1>

          <div className='flex flex-col mb-4'>
            <label className='text-sm font-bold mb-1'>Email</label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='border border-1 border-gray-300 rounded-md p-2'
            />
          </div>
          <div className='flex flex-col mb-4'>
            <label className='text-sm font-bold mb-1'>Password</label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='border border-1 border-gray-300 rounded-md p-2'
            />
          </div>

          {error && (
            <div className=' mb-4'>
              <p className='text-red-500'>{error}</p>
            </div>
          )}

          <button
            type='submit'
            className='bg-[#1D4567] text-white p-2 mb-4 rounded-md'
          >
            <span className='font-bold'>Log in</span>
          </button>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
          />
        </form>

        {/* SIGN UP */}
        <span className='flex justify-center text-sm gap-2'>
          Haven't have an account?{' '}
          <a href='/signup' className='font-bold underline'>
            Signup
          </a>
        </span>
      </div>

      <div className='w-3/5'>
        <img
          src={process.env.PUBLIC_URL + '/assets/hotel_room/room3.jpg'}
          alt='room'
          className='h-[600px] w-full'
        />
      </div>
    </div>
  )
}
export default Login
