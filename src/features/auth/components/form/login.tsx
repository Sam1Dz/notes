'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { loginSchema, type LoginSchema } from '~/features/auth/schemas/auth';
import { signIn } from '~/features/auth/sign-in';
import { Checkbox } from '~/shared/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/shared/components/ui/form';
import { Label } from '~/shared/components/ui/label';
import { Button } from '~/shared/components/ui/shadcn-studio/button';
import { Input } from '~/shared/components/ui/shadcn-studio/input';
import { InputPassword } from '~/shared/components/ui/shadcn-studio/input-password';
import { showToast } from '~/shared/components/ui/shadcn-studio/sonner';

export function AuthFormLogin() {
  const methods = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = methods.watch('rememberMe');

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginSchema) => {
      await signIn('credentials', data);
    },
    onSuccess: () => {
      // Handle successful login
    },
    onError: (error) => {
      showToast({
        message: 'Login Failed',
        description: error.message,
        type: 'error',
      });
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    mutate(data);
  };

  return (
    <Form {...methods}>
      <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {/* Email */}
          <FormField
            control={methods.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={methods.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Password</FormLabel>
                <FormControl>
                  <InputPassword
                    required
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={rememberMe}
                id="remember-me"
                onCheckedChange={(checked) =>
                  methods.setValue('rememberMe', !!checked)
                }
              />
              <Label
                className="text-muted-foreground text-sm font-normal"
                htmlFor="remember-me"
              >
                Remember me
              </Label>
            </div>
            <Link
              className="text-primary hover:text-primary/80 text-sm transition-colors"
              href="#"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Submit button */}
        <Button
          className="w-full cursor-pointer"
          disabled={isPending}
          scale={10}
          type="submit"
        >
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Form>
  );
}
