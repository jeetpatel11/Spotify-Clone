import { Card, CardContent } from '@/components/ui/card'
import { axiosInstance } from '@/lib/axios';
import { useUser } from '@clerk/clerk-react'
import { Loader } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

function AuthCallbackPage() {

  const {isLoaded,user}=useUser();
  const navigate = useNavigate();
  const syncAttempted=useRef(false);

  useEffect(()=>{
    const syncUser=async ()=>{
      if(!isLoaded||!user || syncAttempted.current) return;
      try{
        syncAttempted.current=true
        const res=await axiosInstance.post("/auth/callback",{
          id:user.id,
          firstName:user.firstName,
          lastName:user.lastName,
          imageUrl:user.imageUrl
        })
        console.log("Backend response:", res.data);
      }
      catch(e)
      { console.log(e); } 
      finally
      { navigate("/"); }
    }
    syncUser()
  },[isLoaded,user,navigate])

  return (
    <div className='flex h-screen w-full bg-black justify-center items-center'>
        <Card className='w-[90%] max-w-md bg-zinc-900 border-zinc-800'>
          <CardContent className='flex flex-col gap-4 pt-6 item-center items-center'>
            <Loader className='size-6 text-emerald-500 animate-spin ' />
            <h3 className='text-zinc-400 text-xl font-bold'>Logging you in </h3>
            <p className='text-zinc-400 text-sm'>Redirection...</p>
          </CardContent>
        </Card>
    </div>
  )
}

export default AuthCallbackPage
