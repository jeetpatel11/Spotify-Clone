import { LayoutDashboardIcon } from 'lucide-react';
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import SignInOAuthButton from './SignInOAuthButton';
import { SignedIn, SignedOut,  UserButton } from '@clerk/clerk-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';

function TopBar() {

  const {isAdmin,checkAdminStatus}=useAuthStore();


  useEffect(() => {
  checkAdminStatus();
}, []);


  console.log("ADDDDDDDDdd",isAdmin);

  return (
    <div className='w-full rounded-md flex items-center justify-between top-0 p-4 sticky bg-zinc-900/75 backdrop-blur-md z-10 '>
        <div className="flex gap-2 items-center">
            <img src="/spotify.png"  className='size-8 '/>
            Spotify
        </div>
        <div className='flex items-center gap-4'>
            {isAdmin &&(
                <Link to='/admin'
                className={cn(
                    buttonVariants({variant:'outline',})
                )}>
                    <LayoutDashboardIcon className='size-4 mr-2' />
                    Admin Dashboard
                </Link>
            )}

            

            <SignedOut>
                <SignInOAuthButton/>
            </SignedOut>

            <UserButton/>
        </div>
    </div>
  )
} 

export default TopBar
