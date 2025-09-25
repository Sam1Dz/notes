'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '~/lib/utils/common/class-merger';

/**
 * Provider component for tooltip functionality.
 * Must wrap all tooltip components to provide context and configuration.
 *
 * @param delayDuration - Delay in milliseconds before showing the tooltip (default: 0)
 * @param props - Additional props passed to the Radix Tooltip Provider
 * @returns JSX provider element
 */
export function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

/**
 * Root tooltip component that manages tooltip state.
 * Should wrap TooltipTrigger and TooltipContent components.
 * Automatically includes a TooltipProvider for convenience.
 *
 * @param props - Props passed to the Radix Tooltip Root
 * @returns JSX tooltip root element with provider
 */
export function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

/**
 * Trigger component that activates the tooltip on hover or focus.
 * Should contain the element that users interact with to show the tooltip.
 *
 * @param props - Props passed to the Radix Tooltip Trigger
 * @returns JSX trigger element
 */
export function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * Content component that displays the tooltip message.
 * Includes animations, positioning, and an arrow pointer.
 * Automatically positions itself relative to the trigger.
 *
 * @param className - Additional CSS classes for styling
 * @param sideOffset - Distance from the trigger element (default: 0)
 * @param children - Content to display in the tooltip
 * @param props - Additional props passed to the Radix Tooltip Content
 * @returns JSX tooltip content with arrow and animations
 */
export function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(
          'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
          className,
        )}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
