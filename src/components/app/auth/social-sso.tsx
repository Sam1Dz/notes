'use client';

import { SiGithub } from 'react-icons/si';

import { Button } from '~/components/ui/shadcn-studio/button';
import { signIn } from '~/lib/sign-in';

export function AuthSocialSso() {
  const handleSocialLogin = async () => {
    await signIn('github');
  };

  return (
    <Button
      className="w-full cursor-pointer"
      scale={10}
      variant="outline"
      onClick={() => handleSocialLogin()}
    >
      <SiGithub />
      GitHub
    </Button>
  );
}
