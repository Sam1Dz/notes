'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

/**
 * A themed toast notification component that integrates with the application's theme system.
 * Wraps the Sonner toaster with custom CSS variables for consistent styling across light/dark themes.
 *
 * @param props - Additional props to pass to the underlying Sonner toaster component.
 * @returns A themed toast notification component.
 */
export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      theme={theme as ToasterProps['theme']}
      {...props}
    />
  );
};
