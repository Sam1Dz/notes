'use client';

import { ThemeProvider } from 'next-themes';
import React from 'react';

import { Toaster } from '~/shared/components/ui/sonner';

import { QueryProvider } from './query';

export function BaseProvider({ children }: React.PropsWithChildren) {
  return (
    <QueryProvider>
      <ThemeProvider
        disableTransitionOnChange
        enableSystem
        attribute="class"
        defaultTheme="system"
      >
        {children}

        <Toaster />
      </ThemeProvider>
    </QueryProvider>
  );
}
