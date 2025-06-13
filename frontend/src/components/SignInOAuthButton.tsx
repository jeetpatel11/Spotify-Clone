import { useSignIn } from '@clerk/clerk-react';
import React from 'react'
import { Button } from './ui/button';

function SignInOAuthButton() {

    const {signIn,isLoaded} = useSignIn();

    if (!isLoaded) {
        return null
    }

    const signinwithgoogle = async () => {

        signIn.authenticateWithRedirect({
            strategy: 'oauth_google',
            redirectUrl: '/sso-callback',
            redirectUrlComplete: '/auth-callback',
        });

    }

  return (
    <Button onClick={signinwithgoogle} variant={"secondary"} className='w-full text-white border-zinc-200 h-11'>
        Continue with Google
    </Button>
  )
}

export default SignInOAuthButton
