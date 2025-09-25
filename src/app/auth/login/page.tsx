import Link from 'next/link';

import { AuthFormLogin } from '~/components/app/auth/form/login';
import { AuthLogo } from '~/components/app/auth/logo';
import { AuthSocialSso } from '~/components/app/auth/social-sso';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';

export const metadata = {
  title: 'Login',
};

export default function Page() {
  return (
    <div className="w-full max-w-md space-y-8 py-6">
      <AuthLogo />

      <Card>
        <CardHeader>
          <h1 className="text-foreground text-center text-2xl font-bold">
            Sign in to your account
          </h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <AuthFormLogin />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div>

          <AuthSocialSso />
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Don&#39;t have an account?&nbsp;
          <Link
            className="text-primary hover:text-primary/80 font-medium transition-colors"
            href="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
