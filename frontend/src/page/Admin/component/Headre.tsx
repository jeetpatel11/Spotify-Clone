import { UserButton } from '@clerk/clerk-react'
// import React from 'react'
import { Link } from 'react-router-dom'

function Headre() {
  return (
    
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3 mb-8'>
                <Link to='/' className='rounded-lg'>
                    <img src='/spotify.png' className='size-10 text-black'/>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold'>Music Manager</h1>
                    <p className='text-zinc-400 mt-1'>Manage Your music catalog</p>
                </div>
            </div>
            <UserButton/>
        </div>

  )
}

export default Headre
