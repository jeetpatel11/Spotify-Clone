import { buttonVariants } from '@/components/ui/button'
import { HomeIcon, MessageCircleIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import React from 'react'
import { SignedIn } from '@clerk/clerk-react'

function LeftSidebar() {
  return (
    <div className='flex h-full flex-col gap-2'>

      {/* Navigation Menu */ }
      <div className='rounded-lg bg-zinc-900 p-4 '>
        <div className='space-y-2 items-start'>
            
          <Link 
          to={'/'}
          className={(
            buttonVariants({
            variant:'ghost',
            className: 'w-full justify-start hover:bg-zinc-800 text-white'
          })
        )}
          >
            <HomeIcon className='mr-2 size-5'/>
            <span className='hidden md:inline'>Home</span>
          </Link>
          
          <SignedIn>
          <Link 
          to={'/chat'}
          className={(
            buttonVariants({
            variant:'ghost',
            className:'w-full justify-start hover:bg-zinc-800 text-white '
          })
        )}
          >
            <MessageCircleIcon className='mr-2 size-5'/>
            <span className='hidden md:inline'>Message</span>
          </Link>
          </SignedIn>
           
        </div>
      </div>

      {/* Library section */ }
    </div>
  )
}

export default LeftSidebar
