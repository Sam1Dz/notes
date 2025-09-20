import * as React from 'react';

import { Input as ShadcnInput } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn } from '~/libs/utils';

/**
 * Props for the enhanced Input component with label and icon support.
 */
interface InputProps extends React.ComponentProps<'input'> {
  /** Optional label text displayed above the input */
  label?: string;
  /** Icon component to display at the start of the input */
  startIcon?: React.ComponentType<{ className?: string }>;
  /** Icon component to display at the end of the input */
  endIcon?: React.ComponentType<{ className?: string }>;
  /** Custom class names for different parts of the component */
  classNames?: {
    /** CSS classes for the container div */
    container?: React.HTMLAttributes<HTMLDivElement>['className'];
    /** CSS classes for the input element */
    input?: React.HTMLAttributes<HTMLInputElement>['className'];
  };
  /** Helper text displayed below the input */
  helperText?: string;
  /** Position of the helper text */
  helperTextPosition?: 'start' | 'end';
  /** Hint text displayed next to the label */
  hintText?: string;
  /** Error state of the input */
  error?: boolean;
  /** Error message displayed when error is true */
  errorMessage?: string;
}

/**
 * Enhanced Input component with label, icon, helper text, and error support.
 * Extends the base shadcn Input component with additional features:
 * - Optional label with required asterisk and hint text
 * - Start and end icons with automatic positioning
 * - Helper text with start/end positioning
 * - Error state with custom error messages
 * - Granular class name control
 * - Screen reader support for icons
 * - Proper accessibility attributes
 *
 * @param label - Text to display as the input label
 * @param startIcon - React component for the start icon
 * @param endIcon - React component for the end icon
 * @param classNames - Object containing custom class names for container and input
 * @param helperText - Text to display below the input
 * @param helperTextPosition - Position of helper text ('start' or 'end')
 * @param hintText - Small hint text displayed next to the label
 * @param error - Error state of the input
 * @param errorMessage - Error message to display when error is true
 * @param props - Standard HTML input element props
 * @returns JSX input element with label and optional icons
 *
 * @example
 * ```tsx
 * // Basic input with label
 * <Input label="Email" type="email" placeholder="Enter your email" />
 *
 * // Required input with helper text
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   required
 *   helperText="We'll never share your email with anyone else."
 * />
 *
 * // Input with error
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error
 *   errorMessage="This email is invalid."
 * />
 *
 * // Input with hint text
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   hintText="Optional field"
 * />
 * ```
 */
export function Input({
  label,
  startIcon: StartIcon,
  endIcon: EndIcon,
  classNames,
  helperText,
  helperTextPosition = 'start',
  hintText,
  error,
  errorMessage,
  ...props
}: InputProps) {
  const id = React.useId();

  // Determine if there's an error and what helper text to show
  const hasError = error || props['aria-invalid'];
  const displayHelperText = hasError ? errorMessage : helperText;
  const isRequired = props.required;

  return (
    <div className={cn('w-full space-y-2', classNames?.container)}>
      {label && (
        <div className="flex items-center justify-between gap-1">
          <Label className="gap-1" htmlFor={id}>
            {label}
            {isRequired && <span className="text-error">*</span>}
          </Label>
          {hintText && (
            <span className="text-muted-foreground text-xs">{hintText}</span>
          )}
        </div>
      )}
      <div className="relative">
        {StartIcon && (
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <StartIcon className="size-4" />
            <span className="sr-only">{label || 'Icon'}</span>
          </div>
        )}
        <ShadcnInput
          aria-invalid={hasError}
          className={cn(
            StartIcon && 'ps-9',
            EndIcon && 'pe-9',
            'peer',
            hasError &&
              'aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error',
            classNames?.input,
          )}
          id={id}
          {...props}
          required={false}
        />
        {EndIcon && (
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
            <EndIcon className="size-4" />
            <span className="sr-only">{label || 'Icon'}</span>
          </div>
        )}
      </div>
      {displayHelperText && (
        <p
          className={cn(
            'text-xs',
            hasError ? 'text-error' : 'text-muted-foreground',
            helperTextPosition === 'end' && 'text-end',
          )}
        >
          {displayHelperText}
        </p>
      )}
    </div>
  );
}
