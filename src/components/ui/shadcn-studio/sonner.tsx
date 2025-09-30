'use client';

import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

/**
 * Props for configuring a toast notification.
 */
interface SonnerProps {
  /** The main message text to display in the toast. */
  message: string;
  /** Optional description text that appears below the main message. */
  description?: string;
  /** Optional icon component to display alongside the message. */
  icon?: React.ComponentType<{ className?: string }>;
  /** Optional avatar configuration for user-specific toasts. */
  avatar?: {
    src: string;
    alt: string;
    fallback: string;
  };
  /** Whether to show a close button on the toast. */
  closeButton?: boolean;
  /** Optional action button configuration. */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Position where the toast should appear on screen (default: 'bottom-right'). */
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  /** The type of toast which affects styling and behavior. */
  type?: 'default' | 'info' | 'success' | 'warning' | 'error';
}

/**
 * Options passed to the underlying toast function from the sonner library.
 */
interface ToastOptions {
  /** Optional description text (used when no custom content is provided). */
  description?: string;
  /** Whether to show a close button. */
  closeButton?: boolean;
  /** Optional action button configuration. */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Position for the toast. */
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  /** Custom CSS styles for the toast. */
  style?: React.CSSProperties;
}

/**
 * React component that renders the content of a toast notification.
 * Displays an optional avatar, icon, message, and description in a structured layout.
 *
 * @param props - The props containing message, description, icon, and avatar configuration.
 * @returns A React element representing the toast content.
 */
const SonnerContent: React.FC<{
  message: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  avatar?: {
    src: string;
    alt: string;
    fallback: string;
  };
}> = ({ message, description, icon: Icon, avatar }) => {
  return (
    <div className="flex items-center gap-2">
      {avatar && (
        <Avatar>
          <AvatarImage alt={avatar.alt} src={avatar.src} />
          <AvatarFallback className="text-xs">{avatar.fallback}</AvatarFallback>
        </Avatar>
      )}
      {Icon && <Icon className="size-5.5 shrink-0" />}
      <div>
        {message}
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
    </div>
  );
};

/**
 * Displays a toast notification with customizable content, styling, and behavior.
 * Supports different types (info, success, warning, error) with appropriate theming.
 * Can include avatars, icons, actions, and custom positioning.
 *
 * @param props - Configuration object for the toast notification.
 * @param props.message - The main message text (required).
 * @param props.description - Optional description text.
 * @param props.icon - Optional icon component.
 * @param props.avatar - Optional avatar configuration.
 * @param props.closeButton - Whether to show close button (default: false).
 * @param props.action - Optional action button.
 * @param props.position - Toast position on screen (default: 'bottom-right').
 * @param props.type - Toast type affecting styling (default: 'default').
 */
export const showToast = ({
  message,
  description,
  icon,
  avatar,
  closeButton = false,
  action,
  position = 'bottom-right',
  type = 'default',
}: SonnerProps) => {
  const content =
    avatar || icon ? (
      <SonnerContent
        avatar={avatar}
        description={description}
        icon={icon}
        message={message}
      />
    ) : (
      message
    );

  const options: ToastOptions = {};

  if (description && !avatar && !icon) {
    options.description = description;
  }
  if (closeButton) {
    options.closeButton = true;
  }
  if (action) {
    options.action = action;
  }
  if (position) {
    options.position = position;
  }

  // Set style based on type
  if (type !== 'default') {
    switch (type) {
      case 'info':
        options.style = {
          '--normal-bg':
            'color-mix(in oklab, light-dark(var(--color-info), var(--color-info)) 10%, var(--background))',
          '--normal-text': 'light-dark(var(--color-info), var(--color-info))',
          '--normal-border': 'light-dark(var(--color-info), var(--color-info))',
        } as React.CSSProperties;
        break;
      case 'success':
        options.style = {
          '--normal-bg':
            'color-mix(in oklab, light-dark(var(--color-success), var(--color-success)) 10%, var(--background))',
          '--normal-text':
            'light-dark(var(--color-success), var(--color-success))',
          '--normal-border':
            'light-dark(var(--color-success), var(--color-success))',
        } as React.CSSProperties;
        break;
      case 'warning':
        options.style = {
          '--normal-bg':
            'color-mix(in oklab, light-dark(var(--color-warning), var(--color-warning)) 10%, var(--background))',
          '--normal-text':
            'light-dark(var(--color-warning), var(--color-warning))',
          '--normal-border':
            'light-dark(var(--color-warning), var(--color-warning))',
        } as React.CSSProperties;
        break;
      case 'error':
        options.style = {
          '--normal-bg':
            'color-mix(in oklab, var(--color-error) 10%, var(--background))',
          '--normal-text': 'var(--color-error)',
          '--normal-border': 'var(--color-error)',
        } as React.CSSProperties;
        break;
    }
  }

  // Call the appropriate toast method
  switch (type) {
    case 'info':
      toast.info(content, options);
      break;
    case 'success':
      toast.success(content, options);
      break;
    case 'warning':
      toast.warning(content, options);
      break;
    case 'error':
      toast.error(content, options);
      break;
    default:
      toast(content, options);
  }
};
