import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

function App() {

  return (
    <>
    <header>
      <SignedOut>
        <SignInButton>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
    </>
  )
}

export default App
