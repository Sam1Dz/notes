'use client';

import React from 'react';

import { ThemeProvider } from './theme';

export function Provider({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider
      disableTransitionOnChange
      enableSystem
      attribute="class"
      defaultTheme="system"
    >
      {children}
    </ThemeProvider>
  );
}
