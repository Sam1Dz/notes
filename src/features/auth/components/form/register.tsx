'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/shared/components/ui/form';
import { Button } from '~/shared/components/ui/shadcn-studio/button';
import { Input } from '~/shared/components/ui/shadcn-studio/input';
import {
  registerSchema,
  type RegisterSchema,
} from '~/features/auth/schemas/auth';

export function AuthFormRegister() {
  const [isLoading, setIsLoading] = React.useState(false);

  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (_data: RegisterSchema) => {
    setIsLoading(true);
    try {
      // TODO: Implement register logic
      // console.log('Register data:', data);
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...methods}>
      <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {/* Name */}
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  <Input
                    placeholder="Create a password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={methods.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel isRequired>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit button */}
        <Button
          className="w-full cursor-pointer"
          disabled={isLoading}
          scale={10}
          type="submit"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <Link
              className="text-primary hover:text-primary/80 font-medium transition-colors"
              href="/auth/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
