import * as React from 'react';

import { cn } from '~/libs/utils';

/**
 * The main Card component that wraps content in a styled container.
 * @component
 * @param {React.ComponentProps<'div'>} props - Props for the div element.
 * @param {string} [props.className] - Additional CSS classes.
 */
export function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        className,
      )}
      data-slot="card"
      {...props}
    />
  );
}

/**
 * The header section of the Card component.
 * @component
 * @param {React.ComponentProps<'div'>} props - Props for the div element.
 * @param {string} [props.className] - Additional CSS classes.
 */
export function CardHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      data-slot="card-header"
      {...props}
    />
  );
}

/**
 * The title section of the Card component.
 * @component
 * @param {React.ComponentProps<'div'>} props - Props for the div element.
 * @param {string} [props.className] - Additional CSS classes.
 */
export function CardTitle({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('leading-none font-semibold', className)}
      data-slot="card-title"
      {...props}
    />
  );
}

/**
 * The description section of the Card component.
 * @component
 * @param {React.ComponentProps<'div'>} props - Props for the div element.
 * @param {string} [props.className] - Additional CSS classes.
 */
export function CardDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-muted-foreground text-sm', className)}
      data-slot="card-description"
      {...props}
    />
  );
}

/**
 * The action section of the Card component, typically for buttons or links.
 * @component
 * @param {React.ComponentProps<'div'>} props - Props for the div element.
 * @param {string} [props.className] - Additional CSS classes.
 */
export function CardAction({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      data-slot="card-action"
      {...props}
    />
  );
}

/**
 * The content section of the Card component.
 * @component
 * @param {React.ComponentProps<'div'>} props - Props for the div element.
 * @param {string} [props.className] - Additional CSS classes.
 */
export function CardContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('px-6', className)}
      data-slot="card-content"
      {...props}
    />
  );
}

/**
 * The footer section of the Card component.
 * @component
 * @param {React.ComponentProps<'div'>} props - Props for the div element.
 * @param {string} [props.className] - Additional CSS classes.
 */
export function CardFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      data-slot="card-footer"
      {...props}
    />
  );
}
