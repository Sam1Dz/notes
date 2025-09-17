'use client';

import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '~/libs/utils';

/**
 * Separator component for creating visual dividers between content sections.
 * Built on top of Radix UI's Separator primitive with custom styling.
 *
 * @param className - Additional CSS classes to apply to the separator
 * @param orientation - Direction of the separator: 'horizontal' or 'vertical' (default: 'horizontal')
 * @param decorative - Whether the separator is purely decorative (default: true)
 * @param props - Additional props passed to the Radix Separator primitive
 * @returns JSX separator element
 */
export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      className={cn(
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className,
      )}
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      {...props}
    />
  );
}
