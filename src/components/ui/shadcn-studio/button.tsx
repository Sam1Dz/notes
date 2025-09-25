'use client';

import type { VariantProps } from 'class-variance-authority';

import { motion, type HTMLMotionProps, type Transition } from 'motion/react';
import * as React from 'react';

import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/utils/common/class-merger';

/**
 * Represents a single ripple effect instance with positioning data.
 */
interface Ripple {
  /** Unique identifier for the ripple instance */
  id: number;
  /** X coordinate of the ripple center relative to the button */
  x: number;
  /** Y coordinate of the ripple center relative to the button */
  y: number;
}

/**
 * Props for the Button component, extending motion button props and button variants.
 */
export interface ButtonProps
  extends HTMLMotionProps<'button'>,
    VariantProps<typeof buttonVariants> {
  /** The content to be rendered inside the button */
  children: React.ReactNode;
  /** Scale factor for the ripple effect animation (default: 10) */
  scale?: number;
  /** Transition configuration for the ripple animation */
  transition?: Transition;
}

/**
 * An enhanced button component with animated ripple effects on click.
 *
 * This component extends the base button with Framer Motion animations,
 * creating a material design-inspired ripple effect that originates from
 * the click position and expands outward.
 *
 * @example
 * ```tsx
 * <Button variant="default" size="sm">
 *   Click me!
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button
 *   variant="outline"
 *   scale={15}
 *   transition={{ duration: 0.8, ease: 'easeInOut' }}
 *   onClick={handleClick}
 * >
 *   Custom Ripple
 * </Button>
 * ```
 */
export function Button({
  ref,
  children,
  onClick,
  className,
  variant,
  size,
  scale = 10,
  transition = { duration: 0.6, ease: 'easeOut' },
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

  const createRipple = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;

      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const newRipple: Ripple = {
        id: Date.now(),
        x,
        y,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    },
    [],
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event);

      if (onClick) {
        onClick(event);
      }
    },
    [createRipple, onClick],
  );

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        buttonVariants({ variant, size }),
        'relative overflow-hidden',
        className,
      )}
      data-slot="ripple-button"
      onClick={handleClick}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          animate={{ scale, opacity: 0 }}
          className="pointer-events-none absolute size-5 rounded-full bg-current"
          initial={{ scale: 0, opacity: 0.5 }}
          style={{
            top: ripple.y - 10,
            left: ripple.x - 10,
          }}
          transition={transition}
        />
      ))}
    </motion.button>
  );
}
