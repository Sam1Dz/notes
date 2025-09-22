'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { Checkbox } from '~/frontend/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/frontend/components/ui/form';
import { Label } from '~/frontend/components/ui/label';
import { Button } from '~/frontend/components/ui/shadcn-studio/button';
import { Input } from '~/frontend/components/ui/shadcn-studio/input';
import { loginSchema, type LoginSchema } from '~/schemas/auth';

export function AuthFormLogin() {
  const [isLoading, setIsLoading] = React.useState(false);

  const methods = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = methods.watch('rememberMe');

  const onSubmit = async (_data: LoginSchema) => {
    setIsLoading(true);
    try {
      // TODO: Implement login logic
      // console.log('Login data:', data);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
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
                  <Input
                    required
                    placeholder="Enter your password"
                    type="password"
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
          disabled={isLoading}
          scale={10}
          type="submit"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Form>
  );
}
