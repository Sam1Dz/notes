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
}

/**
 * Enhanced Input component with label and icon support.
 * Extends the base shadcn Input component with additional features:
 * - Optional label with proper accessibility
 * - Start and end icons with automatic positioning
 * - Container styling and layout
 * - Screen reader support for icons
 * - Granular class name control
 *
 * @param label - Text to display as the input label
 * @param startIcon - React component for the start icon
 * @param endIcon - React component for the end icon
 * @param classNames - Object containing custom class names for container and input
 * @param props - Standard HTML input element props
 * @returns JSX input element with label and optional icons
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   startIcon={MailIcon}
 *   classNames={{
 *     container: "max-w-md",
 *     input: "border-blue-500"
 *   }}
 * />
 * ```
 */
export function Input({
  label,
  startIcon: StartIcon,
  endIcon: EndIcon,
  classNames,
  ...props
}: InputProps) {
  const id = React.useId();

  return (
    <div className={cn('w-full max-w-xs space-y-2', classNames?.container)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        {StartIcon && (
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <StartIcon className="size-4" />
            <span className="sr-only">{label || 'Icon'}</span>
          </div>
        )}
        <ShadcnInput
          className={cn(
            StartIcon && 'ps-9',
            EndIcon && 'pe-9',
            'peer',
            classNames?.input,
          )}
          id={id}
          {...props}
        />
        {EndIcon && (
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
            <EndIcon className="size-4" />
            <span className="sr-only">{label || 'Icon'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
