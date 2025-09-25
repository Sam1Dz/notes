'use client';

import { SiGithub } from 'react-icons/si';

import { Button } from '~/components/ui/shadcn-studio/button';

export function AuthSocialSso() {
  const handleSocialLogin = (_provider: 'google' | 'github') => {
    // TODO: Implement social login
    // console.log(`Login with ${provider}`);
  };

  return (
    <Button
      className="w-full cursor-pointer"
      scale={10}
      variant="outline"
      onClick={() => handleSocialLogin('github')}
    >
      <SiGithub />
      GitHub
    </Button>
  );
}
