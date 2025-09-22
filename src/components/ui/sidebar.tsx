'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { LuMenu } from 'react-icons/lu';

import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { Button } from '~/components/ui/shadcn-studio/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import { Skeleton } from '~/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { useIsMobile } from '~/hooks/use-mobile';
import { cn } from '~/utils/core/class-merger';

/**
 * Cookie name for storing sidebar state.
 */
const SIDEBAR_COOKIE_NAME = 'sidebar_state';

/**
 * Maximum age for the sidebar state cookie (7 days in seconds).
 */
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/**
 * Default width of the sidebar on desktop.
 */
const SIDEBAR_WIDTH = '16rem';

/**
 * Width of the sidebar on mobile devices.
 */
const SIDEBAR_WIDTH_MOBILE = '18rem';

/**
 * Width of the sidebar when collapsed to icon-only mode.
 */
const SIDEBAR_WIDTH_ICON = '3rem';

/**
 * Keyboard shortcut key for toggling the sidebar (Ctrl/Cmd + B).
 */
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

/**
 * Context properties for the sidebar state management.
 */
interface SidebarContextProps {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

/**
 * Hook to access the sidebar context.
 * Must be used within a SidebarProvider.
 * @returns The sidebar context with state and control functions.
 */
export function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

/**
 * Provider component that manages the sidebar state and provides context to child components.
 * Handles responsive behavior, keyboard shortcuts, and state persistence.
 *
 * @param defaultOpen - Whether the sidebar should be open by default (default: true)
 * @param open - Controlled open state
 * @param onOpenChange - Callback when open state changes
 * @param className - Additional CSS classes
 * @param style - Additional inline styles
 * @param children - Child components
 * @param props - Additional div props
 */
export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value;

      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          className={cn(
            'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
            className,
          )}
          data-slot="sidebar-wrapper"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

/**
 * Main sidebar component with responsive behavior and multiple variants.
 * Automatically adapts to mobile/desktop and supports different collapsible modes.
 *
 * @param side - Position of the sidebar: 'left' or 'right' (default: 'left')
 * @param variant - Visual variant: 'sidebar', 'floating', or 'inset' (default: 'sidebar')
 * @param collapsible - Collapse behavior: 'offcanvas', 'icon', or 'none' (default: 'offcanvas')
 * @param className - Additional CSS classes
 * @param children - Child components
 * @param props - Additional div props
 */
export function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === 'none') {
    return (
      <div
        className={cn(
          'bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col',
          className,
        )}
        data-slot="sidebar"
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          data-mobile="true"
          data-sidebar="sidebar"
          data-slot="sidebar"
          side={side}
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-side={side}
      data-slot="sidebar"
      data-state={state}
      data-variant={variant}
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        className={cn(
          'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        )}
        data-slot="sidebar-gap"
      />
      <div
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className,
        )}
        data-slot="sidebar-container"
        {...props}
      >
        <div
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Button component that toggles the sidebar open/closed state.
 * Includes keyboard shortcut support (Ctrl/Cmd + B) and proper accessibility features.
 *
 * @example
 * ```tsx
 * <SidebarTrigger />
 * ```
 *
 * @example
 * ```tsx
 * <SidebarTrigger
 *   className="md:hidden"
 *   onClick={handleCustomClick}
 * />
 * ```
 */
export function SidebarTrigger({
  className,
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'children'>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      className={className}
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      size="icon"
      variant="ghost"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <LuMenu />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

/**
 * Invisible rail area that allows dragging to resize or toggle the sidebar.
 * Provides a larger hit area for toggling on desktop.
 */
export function SidebarRail({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      aria-label="Toggle Sidebar"
      className={cn(
        'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className,
      )}
      data-sidebar="rail"
      data-slot="sidebar-rail"
      tabIndex={-1}
      title="Toggle Sidebar"
      onClick={toggleSidebar}
      {...props}
    />
  );
}

/**
 * Main content area that adjusts its layout based on the sidebar state.
 * Provides proper spacing and styling for the main application content.
 */
export function SidebarInset({
  className,
  ...props
}: React.ComponentProps<'main'>) {
  return (
    <main
      className={cn(
        'bg-background relative flex w-full flex-1 flex-col',
        'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
        className,
      )}
      data-slot="sidebar-inset"
      {...props}
    />
  );
}

/**
 * Input component styled specifically for use within the sidebar.
 * Provides consistent styling with the sidebar theme.
 */
export function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn('bg-background h-8 w-full shadow-none', className)}
      data-sidebar="input"
      data-slot="sidebar-input"
      {...props}
    />
  );
}

/**
 * Header section of the sidebar, typically containing branding or main navigation.
 */
export function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2 p-2', className)}
      data-sidebar="header"
      data-slot="sidebar-header"
      {...props}
    />
  );
}

/**
 * Footer section of the sidebar, typically containing user info or secondary actions.
 */
export function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2 p-2', className)}
      data-sidebar="footer"
      data-slot="sidebar-footer"
      {...props}
    />
  );
}

/**
 * Separator component styled for use within the sidebar.
 * Provides visual separation between different sections.
 */
export function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn('bg-sidebar-border mx-2 w-auto', className)}
      data-sidebar="separator"
      data-slot="sidebar-separator"
      {...props}
    />
  );
}

/**
 * Main content area of the sidebar where menu items and other content are placed.
 * Handles scrolling and responsive behavior.
 */
export function SidebarContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className,
      )}
      data-sidebar="content"
      data-slot="sidebar-content"
      {...props}
    />
  );
}

/**
 * Grouping component for organizing related sidebar items.
 * Provides consistent spacing and layout for grouped content.
 */
export function SidebarGroup({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      data-sidebar="group"
      data-slot="sidebar-group"
      {...props}
    />
  );
}

/**
 * Label component for sidebar groups, providing a heading for grouped items.
 * Supports optional rendering as different HTML elements.
 *
 * @param className - Additional CSS classes
 * @param asChild - Whether to render as a different element using Slot
 * @param props - Additional div props
 */
export function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className={cn(
        'text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className,
      )}
      data-sidebar="group-label"
      data-slot="sidebar-group-label"
      {...props}
    />
  );
}

/**
 * Action button component for sidebar groups, typically used for group-level actions.
 * Supports optional rendering as different HTML elements.
 *
 * @param className - Additional CSS classes
 * @param asChild - Whether to render as a different element using Slot
 * @param props - Additional button props
 */
export function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 md:after:hidden',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      data-sidebar="group-action"
      data-slot="sidebar-group-action"
      {...props}
    />
  );
}

/**
 * Content container for sidebar groups.
 * Provides consistent text styling for group content.
 */
export function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('w-full text-sm', className)}
      data-sidebar="group-content"
      data-slot="sidebar-group-content"
      {...props}
    />
  );
}

/**
 * Unordered list component for sidebar menu items.
 * Provides consistent spacing and layout for menu navigation.
 */
export function SidebarMenu({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      data-sidebar="menu"
      data-slot="sidebar-menu"
      {...props}
    />
  );
}

/**
 * List item component for individual sidebar menu items.
 * Provides hover states and action positioning context.
 */
export function SidebarMenuItem({
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      className={cn('group/menu-item relative', className)}
      data-sidebar="menu-item"
      data-slot="sidebar-menu-item"
      {...props}
    />
  );
}

/**
 * Variants for sidebar menu buttons using class-variance-authority.
 * Defines different visual styles and sizes for menu buttons.
 */
const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

/**
 * Button component for sidebar menu items with support for tooltips and active states.
 * Automatically shows tooltips when the sidebar is collapsed.
 *
 * @example
 * ```tsx
 * <SidebarMenuButton>
 *   <HomeIcon />
 *   <span>Home</span>
 * </SidebarMenuButton>
 * ```
 *
 * @example
 * ```tsx
 * <SidebarMenuButton
 *   isActive={true}
 *   tooltip="Dashboard"
 *   size="lg"
 * >
 *   <DashboardIcon />
 *   <span>Dashboard</span>
 * </SidebarMenuButton>
 * ```
 *
 * @param asChild - Whether to render as a different element using Slot
 * @param isActive - Whether this menu item is currently active/selected
 * @param variant - Visual variant: 'default' or 'outline'
 * @param size - Size variant: 'default', 'sm', or 'lg'
 * @param tooltip - Tooltip content to show when collapsed, or tooltip props object
 * @param className - Additional CSS classes
 * @param props - Additional button props
 */
export function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : 'button';
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      data-active={isActive}
      data-sidebar="menu-button"
      data-size={size}
      data-slot="sidebar-menu-button"
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        align="center"
        hidden={state !== 'collapsed' || isMobile}
        side="right"
        {...tooltip}
      />
    </Tooltip>
  );
}

/**
 * Action button component for individual menu items.
 * Typically used for item-specific actions like delete, edit, or settings.
 * Positioned absolutely within the menu item and shows on hover by default.
 *
 * @example
 * ```tsx
 * <SidebarMenuItem>
 *   <SidebarMenuButton>Item Name</SidebarMenuButton>
 *   <SidebarMenuAction onClick={handleEdit}>
 *     <EditIcon />
 *   </SidebarMenuAction>
 * </SidebarMenuItem>
 * ```
 *
 * @param className - Additional CSS classes
 * @param asChild - Whether to render as a different element using Slot
 * @param showOnHover - Whether to show the action only on hover
 * @param props - Additional button props
 */
export function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 md:after:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0',
        className,
      )}
      data-sidebar="menu-action"
      data-slot="sidebar-menu-action"
      {...props}
    />
  );
}

/**
 * Badge component for displaying additional information on menu items.
 * Typically used for counts, status indicators, or notifications.
 */
export function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none',
        'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      data-sidebar="menu-badge"
      data-slot="sidebar-menu-badge"
      {...props}
    />
  );
}

/**
 * Skeleton loading component for sidebar menu items.
 * Shows a placeholder while menu content is loading.
 * Generates random widths between 50-90% for realistic loading appearance.
 *
 * @example
 * ```tsx
 * <SidebarMenuSkeleton />
 * ```
 *
 * @example
 * ```tsx
 * <SidebarMenuSkeleton showIcon={true} />
 * ```
 *
 * @param className - Additional CSS classes
 * @param showIcon - Whether to show an icon skeleton
 * @param props - Additional div props
 */
export function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<'div'> & {
  showIcon?: boolean;
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      className={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
      data-sidebar="menu-skeleton"
      data-slot="sidebar-menu-skeleton"
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

/**
 * Sub-menu component for nested navigation items.
 * Provides indented styling for hierarchical menu structures.
 */
export function SidebarMenuSub({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn(
        'border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      data-sidebar="menu-sub"
      data-slot="sidebar-menu-sub"
      {...props}
    />
  );
}

/**
 * List item component for sub-menu items.
 * Provides context for sub-menu item styling and behavior.
 */
export function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      className={cn('group/menu-sub-item relative', className)}
      data-sidebar="menu-sub-item"
      data-slot="sidebar-menu-sub-item"
      {...props}
    />
  );
}

/**
 * Button component for sub-menu items with support for active states.
 * Provides consistent styling for nested navigation links.
 * Automatically hidden when sidebar is in icon-only mode.
 *
 * @example
 * ```tsx
 * <SidebarMenuSubButton href="/settings/profile">
 *   Profile Settings
 * </SidebarMenuSubButton>
 * ```
 *
 * @example
 * ```tsx
 * <SidebarMenuSubButton
 *   href="/settings/advanced"
 *   isActive={true}
 *   size="sm"
 * >
 *   Advanced Options
 * </SidebarMenuSubButton>
 * ```
 *
 * @param asChild - Whether to render as a different element using Slot
 * @param size - Size variant: 'sm' or 'md'
 * @param isActive - Whether this sub-menu item is currently active
 * @param className - Additional CSS classes
 * @param props - Additional anchor props
 */
export function SidebarMenuSubButton({
  asChild = false,
  size = 'md',
  isActive = false,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean;
  size?: 'sm' | 'md';
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      className={cn(
        'text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
        'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      data-active={isActive}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-slot="sidebar-menu-sub-button"
      {...props}
    />
  );
}
