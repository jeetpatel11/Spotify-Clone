import { LayoutDashboardIcon } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom'
import SignInOAuthButton from './SignInOAuthButton';
import { SignedIn, SignedOut, SignOutButton } from '@clerk/clerk-react';

function TopBar() {

    const isAdmin = true; // Replace with actual admin check logic

  return (
    <div className='w-full flex items-center justify-between top-0 p-4 sticky bg-zinc-900/75 backdrop-blur-md z-10 '>
        <div className="flex gap-2 items-center">
            Spotify
        </div>
        <div className='flex items-center gap-4'>
            {isAdmin &&(
                <Link to='/admin'>
                    <LayoutDashboardIcon className='size-4 mr-2' />
                    Admin Dashboard
                </Link>
            )}

            <SignedIn>  
                <SignOutButton/>
            </SignedIn>

            <SignedOut>
                <SignInOAuthButton/>
            </SignedOut>
        </div>
    </div>
  )
} 

export default TopBar
