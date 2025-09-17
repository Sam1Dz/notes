import { cn } from '~/libs/utils';

/**
 * Input component with custom styling and accessibility features.
 * Provides a styled input field with focus states, validation states, and dark mode support.
 *
 * @param className - Additional CSS classes to apply to the input
 * @param type - Input type (text, password, email, etc.)
 * @param props - Standard HTML input element props
 * @returns JSX input element with custom styling
 */
export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}
