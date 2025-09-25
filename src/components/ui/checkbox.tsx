'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';
import { LuCheck } from 'react-icons/lu';

import { cn } from '~/lib/utils/common/class-merger';

/**
 * A customizable checkbox component built on top of Radix UI's Checkbox primitive.
 * It supports all props from Radix UI's CheckboxPrimitive.Root and includes custom styling
 * for themes, focus states, and accessibility.
 *
 * @component
 * @param {React.ComponentProps<typeof CheckboxPrimitive.Root>} props - The props for the checkbox, including all Radix UI CheckboxPrimitive.Root props.
 * @param {string} [props.className] - Additional CSS classes to apply to the checkbox for custom styling.
 * @example
 * ```tsx
 * <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
 * ```
 */
export function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="flex items-center justify-center text-current transition-none"
        data-slot="checkbox-indicator"
      >
        <LuCheck className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
