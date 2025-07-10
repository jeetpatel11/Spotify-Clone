// import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import HomePage from './page/Home/HomePage';
import AuthCallbackPage from './page/Auth-callback/AuthCallbackPage';
// import { axiosInstance } from '../src/lib/axios.ts';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import MainLayout from './layout/MainLayout.tsx';
import ChatPage from './page/chat/ChatPage.tsx';
import AlbumPage from './page/album/AlbumPage.tsx';
import AdminPage from './page/Admin/AdminPage.tsx';
import {Toaster} from "react-hot-toast";
import NotFoundPage from './page/404/NotFoundPage.tsx';

function App() {

  // const getSomeData = async () => {
  //   const res=await axiosInstance.get('/users',{
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     }
  //   });
    
  // console.log(res);
  // }

  return (
    <>
    <Routes>
        <Route 
        path='/sso-callback' 
        element={<AuthenticateWithRedirectCallback signInForceRedirectUrl={"/auth-callback"}/>}/>
        
        <Route path='/admin' element={<AdminPage/>}/>
        <Route path='/auth-callback' element={<AuthCallbackPage/>}/>
        <Route element={<MainLayout/>}>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/chat' element={<ChatPage/>}/>
          <Route path='/albums/:id' element={<AlbumPage/>}/>
          <Route path='/*' element={<NotFoundPage/>}/>
        </Route>
 
    </Routes>
    <Toaster/>
    </>
  )
}

export default App
