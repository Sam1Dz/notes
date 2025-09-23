'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

import { cn } from '~/utils/core/class-merger';

/**
 * Label component for form inputs and interactive elements.
 * Built on top of Radix UI's Label primitive with custom styling and accessibility features.
 * Automatically handles disabled states and provides consistent typography.
 *
 * @param className - Additional CSS classes to apply to the label
 * @param props - Standard HTML label element props
 * @returns JSX label element with custom styling and accessibility attributes
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      data-slot="label"
      {...props}
    />
  );
}

export { Label };
