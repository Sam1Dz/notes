'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

import { cn } from '~/shared/utils/common/class-merger';

/**
 * Root avatar component that provides the container and context for avatar images and fallbacks.
 * Built on top of Radix UI's Avatar primitive with custom styling.
 *
 * @param className - Additional CSS classes for styling
 * @param props - Additional props passed to the Radix Avatar Root
 * @returns JSX avatar container element
 */
export function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      data-slot="avatar"
      {...props}
    />
  );
}

/**
 * Avatar image component that displays the user's profile picture.
 * Should be used within an Avatar component and will automatically show the fallback if the image fails to load.
 *
 * @param className - Additional CSS classes for styling
 * @param props - Additional props passed to the Radix Avatar Image
 * @returns JSX avatar image element
 */
export function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn('aspect-square size-full', className)}
      data-slot="avatar-image"
      {...props}
    />
  );
}

/**
 * Avatar fallback component that displays when the avatar image fails to load or is not provided.
 * Typically contains initials, an icon, or other placeholder content.
 *
 * @param className - Additional CSS classes for styling
 * @param props - Additional props passed to the Radix Avatar Fallback
 * @returns JSX avatar fallback element
 */
export function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'bg-muted flex size-full items-center justify-center rounded-full',
        className,
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  );
}
