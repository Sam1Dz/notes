'use client';

import * as React from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

import { Button } from '~/shared/components/ui/shadcn-studio/button';
import { Input } from '~/shared/components/ui/shadcn-studio/input';

/**
 * Props for the Password Input component.
 * Extends InputProps with password-specific functionality.
 */
interface InputPasswordProps extends React.ComponentProps<typeof Input> {
  /** Whether to show the password toggle button */
  showToggle?: boolean;
}

/**
 * Password Input component with toggle visibility functionality.
 * Extends the enhanced Input component with password-specific features:
 * - Password visibility toggle with eye/eye-off icons
 * - Proper accessibility for screen readers
 * - Maintains all Input component features (label, helper text, error states, etc.)
 * - Uses Input component's built-in endInlineButton for proper button positioning
 *
 * @param showToggle - Whether to show the password toggle button (default: true)
 * @param props - All props from the Input component
 * @returns JSX password input element with toggle button
 *
 * @example
 * ```tsx
 * <InputPassword
 *   label="Password"
 *   placeholder="Enter your password"
 *   required
 *   helperText="Must be at least 8 characters"
 * />
 * ```
 */
export function InputPassword({
  showToggle = true,
  classNames,
  ...props
}: InputPasswordProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = React.useCallback(() => {
    setIsVisible((prevState) => !prevState);
  }, []);

  return (
    <Input
      classNames={classNames}
      endInlineButton={
        showToggle
          ? () => (
              <Button
                className="text-muted-foreground focus-visible:ring-ring/50 h-full w-9 rounded-l-none hover:bg-transparent"
                size="icon"
                tabIndex={-1}
                type="button"
                variant="ghost"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <LuEyeOff className="size-4" />
                ) : (
                  <LuEye className="size-4" />
                )}
                <span className="sr-only">
                  {isVisible ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            )
          : undefined
      }
      type={isVisible ? 'text' : 'password'}
      {...props}
    />
  );
}
