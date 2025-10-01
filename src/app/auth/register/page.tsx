import Link from 'next/link';

import { AuthFormRegister } from '~/features/auth/components/form/register';
import { AuthLogo } from '~/features/auth/components/logo';
import { AuthSocialSso } from '~/features/auth/components/social-sso';
import { Card, CardContent, CardHeader } from '~/shared/components/ui/card';
import { Separator } from '~/shared/components/ui/separator';

export const metadata = {
  title: 'Register',
};

export default function Page() {
  return (
    <div className="w-full max-w-md space-y-8 py-6">
      <AuthLogo />

      <Card>
        <CardHeader>
          <h1 className="text-foreground text-center text-2xl font-bold">
            Register for an account
          </h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <AuthFormRegister />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-2">
                Or register with
              </span>
            </div>
          </div>
          <AuthSocialSso />
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?&nbsp;
          <Link
            className="text-primary hover:text-primary/80 font-medium transition-colors"
            href="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
