import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import HomePage from './page/Home/HomePage';
import AuthCallbackPage from './page/Auth-callback/AuthCallbackPage';
import { axiosInstance } from '../src/lib/axios.ts';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import MainLayout from './layout/MainLayout.tsx';
import ChatPage from './page/chat/ChatPage.tsx';

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
        <Route 
        path='/sso-callback' 
        element={<AuthenticateWithRedirectCallback signInForceRedirectUrl={"/auth-callback"}/>}/>
        <Route path='/auth-callback' element={<AuthCallbackPage/>}/>
        <Route element={<MainLayout/>}>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/chat' element={<ChatPage/>}/>
        </Route>

    </Routes>
    </>
  )
}

export default App
