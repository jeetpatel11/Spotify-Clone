
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios.ts';
import {Loader} from 'lucide-react'
const updateApitoken = (token: string | null) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        axiosInstance.defaults.headers.common['Authorization'] = '';
    }
}


function AuthProvider({children}: {children: React.ReactNode}) {



    const {getToken}= useAuth();
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
    const initializeAuth = async () => {
            try{
        const token = await getToken();
                updateApitoken(token);

                
            }
            catch (error) {   
                updateApitoken(null);
        console.error('Error fetching token:', error);
            }
            finally {
        setLoading(false);
      }
    };
    initializeAuth();
},[getToken])


if (loading) {
    return <div className='h-screen w-full flex justify-center items-center '>
                <Loader className='size-8 text-emerald-500 animate-spin items-center' />
            </div>
  }

  return (
    <div>
      {children}
    </div>
  )
}

export default AuthProvider
