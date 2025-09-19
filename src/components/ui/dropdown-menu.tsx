'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { LuChevronRight, LuCircle, LuMenu } from 'react-icons/lu';

import { cn } from '~/libs/utils';

/**
 * Root component for dropdown menu functionality.
 * Provides the context and state management for all dropdown menu components.
 * Must wrap all other dropdown menu components.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Item 1</DropdownMenuItem>
 *     <DropdownMenuItem>Item 2</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
export function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

/**
 * Portal component that renders dropdown content outside the DOM hierarchy.
 * Ensures proper layering and prevents clipping by parent containers.
 */
export function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  );
}

/**
 * Trigger component that opens/closes the dropdown menu when clicked.
 * Typically contains the button or element that activates the dropdown.
 *
 * @example
 * ```tsx
 * <DropdownMenuTrigger asChild>
 *   <Button variant="outline">Open Menu</Button>
 * </DropdownMenuTrigger>
 * ```
 */
export function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

/**
 * Content container for dropdown menu items.
 * Renders with smooth animations and proper positioning relative to the trigger.
 *
 * @param className - Additional CSS classes
 * @param sideOffset - Distance from trigger in pixels (default: 4)
 * @param props - Additional Radix UI content props
 *
 * @example
 * ```tsx
 * <DropdownMenuContent className="w-56">
 *   <DropdownMenuItem>Profile</DropdownMenuItem>
 *   <DropdownMenuItem>Settings</DropdownMenuItem>
 *   <DropdownMenuSeparator />
 *   <DropdownMenuItem>Logout</DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 */
export function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
          className,
        )}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

/**
 * Groups related dropdown menu items together.
 * Provides semantic grouping for better organization and accessibility.
 */
export function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

/**
 * Individual menu item with support for different variants.
 * Supports destructive styling for dangerous actions.
 *
 * @param className - Additional CSS classes
 * @param inset - Whether to add left padding for alignment
 * @param variant - Visual variant: 'default' or 'destructive'
 * @param props - Additional Radix UI item props
 *
 * @example
 * ```tsx
 * <DropdownMenuItem>Edit Profile</DropdownMenuItem>
 * <DropdownMenuItem variant="destructive">Delete Account</DropdownMenuItem>
 * ```
 */
export function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-inset={inset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      {...props}
    />
  );
}

/**
 * Checkbox menu item with checkmark indicator.
 * Supports controlled checked state for toggleable options.
 *
 * @param className - Additional CSS classes
 * @param children - Menu item content
 * @param checked - Whether the checkbox is checked
 * @param props - Additional Radix UI checkbox item props
 *
 * @example
 * ```tsx
 * <DropdownMenuCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
 *   Show Toolbar
 * </DropdownMenuCheckboxItem>
 * ```
 */
export function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-slot="dropdown-menu-checkbox-item"
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <LuMenu className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

/**
 * Radio group component for mutually exclusive selections.
 * Groups radio items together and manages their state.
 */
export function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

/**
 * Radio menu item with circular indicator.
 * Part of a radio group for single selection from multiple options.
 *
 * @param className - Additional CSS classes
 * @param children - Menu item content
 * @param props - Additional Radix UI radio item props
 *
 * @example
 * ```tsx
 * <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
 *   <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
 *   <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
 *   <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
 * </DropdownMenuRadioGroup>
 * ```
 */
export function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-slot="dropdown-menu-radio-item"
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <LuCircle className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

/**
 * Label component for organizing dropdown menu sections.
 * Provides semantic labeling for groups of menu items.
 *
 * @param className - Additional CSS classes
 * @param inset - Whether to add left padding for alignment
 * @param props - Additional Radix UI label props
 *
 * @example
 * ```tsx
 * <DropdownMenuLabel>Account</DropdownMenuLabel>
 * <DropdownMenuItem>Profile</DropdownMenuItem>
 * <DropdownMenuItem>Settings</DropdownMenuItem>
 * ```
 */
export function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
        className,
      )}
      data-inset={inset}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
}

/**
 * Visual separator for dividing dropdown menu sections.
 * Provides clear visual separation between different groups of items.
 *
 * @param className - Additional CSS classes
 * @param props - Additional Radix UI separator props
 *
 * @example
 * ```tsx
 * <DropdownMenuItem>Profile</DropdownMenuItem>
 * <DropdownMenuSeparator />
 * <DropdownMenuItem>Logout</DropdownMenuItem>
 * ```
 */
export function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
}

/**
 * Component for displaying keyboard shortcuts next to menu items.
 * Automatically positions itself to the right of the menu item content.
 *
 * @param className - Additional CSS classes
 * @param props - Additional span props
 *
 * @example
 * ```tsx
 * <DropdownMenuItem>
 *   Save
 *   <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
 * </DropdownMenuItem>
 * ```
 */
export function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        className,
      )}
      data-slot="dropdown-menu-shortcut"
      {...props}
    />
  );
}

/**
 * Container for sub-menu functionality.
 * Enables nested dropdown menus within the main dropdown.
 */
export function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

/**
 * Trigger component for opening sub-menus.
 * Displays an arrow indicator and handles sub-menu state.
 *
 * @param className - Additional CSS classes
 * @param inset - Whether to add left padding for alignment
 * @param children - Trigger content (typically text and optional icon)
 * @param props - Additional Radix UI sub-trigger props
 *
 * @example
 * ```tsx
 * <DropdownMenuSub>
 *   <DropdownMenuSubTrigger>
 *     More Options
 *   </DropdownMenuSubTrigger>
 *   <DropdownMenuSubContent>
 *     <DropdownMenuItem>Option 1</DropdownMenuItem>
 *     <DropdownMenuItem>Option 2</DropdownMenuItem>
 *   </DropdownMenuSubContent>
 * </DropdownMenuSub>
 * ```
 */
export function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8',
        className,
      )}
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
    >
      {children}
      <LuChevronRight className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

/**
 * Content container for sub-menu items.
 * Renders nested dropdown content with proper positioning and animations.
 *
 * @param className - Additional CSS classes
 * @param props - Additional Radix UI sub-content props
 *
 * @example
 * ```tsx
 * <DropdownMenuSubContent>
 *   <DropdownMenuItem>Sub Option 1</DropdownMenuItem>
 *   <DropdownMenuItem>Sub Option 2</DropdownMenuItem>
 *   <DropdownMenuSeparator />
 *   <DropdownMenuItem>Sub Option 3</DropdownMenuItem>
 * </DropdownMenuSubContent>
 * ```
 */
export function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
        className,
      )}
      data-slot="dropdown-menu-sub-content"
      {...props}
    />
  );
}
