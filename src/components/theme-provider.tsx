'use client';

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes';

/**
 * Theme provider component that wraps next-themes ThemeProvider.
 * Enables theme switching and persistence in the application.
 * @param props - The props for the theme provider, including children and theme options.
 * @returns The JSX element wrapping the children with theme context.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
