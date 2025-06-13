import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import HomePage from './page/Home/HomePage';
import AuthCallbackPage from './page/Auth-callback/AuthCallbackPage';
import { axiosInstance } from '../src/lib/axios.ts';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

function App() {

  const getSomeData = async () => {
    const res=await axiosInstance.get('/users',{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
  console.log(res);
  }

  return (
    <>
    <Routes>
        <Route path='/' element={<HomePage/>}/>

        <Route 
        path='/sso-callback' 
        element={<AuthenticateWithRedirectCallback signInForceRedirectUrl={"/auth-callback"}/>}/>
        
        <Route path='/auth-callback' element={<AuthCallbackPage/>}/>
    </Routes>
    </>
  )
}

export default App
