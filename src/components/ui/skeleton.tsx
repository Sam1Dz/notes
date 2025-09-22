import { cn } from '~/utils/core/class-merger';

/**
 * Skeleton component for displaying loading placeholders.
 * Renders an animated pulse effect to indicate content is loading.
 * Can be styled with different shapes and sizes using className.
 *
 * @param className - Additional CSS classes to customize the skeleton shape and size
 * @param props - Standard HTML div element props
 * @returns JSX div element with skeleton loading animation
 */
export function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('bg-accent animate-pulse rounded-md', className)}
      data-slot="skeleton"
      {...props}
    />
  );
}
