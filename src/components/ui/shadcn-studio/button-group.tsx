import * as React from 'react';

import { cn } from '~/lib/utils/common/class-merger';

/**
 * Props for the ButtonGroup component.
 */
interface ButtonGroupProps {
  /** The child elements to be rendered as grouped buttons */
  children: React.ReactNode;
  /** Additional CSS classes to apply to the button group container */
  className?: string;
}

/**
 * Button group component that renders multiple buttons as a cohesive unit.
 * Automatically handles border radius and spacing between adjacent buttons
 * to create a seamless grouped appearance.
 *
 * The component uses flexbox layout and clones each child button to apply appropriate styling:
 * - First button gets left-rounded corners
 * - Last button gets right-rounded corners
 * - Middle buttons have no border radius
 * - All buttons have their shadows removed to prevent visual overlap
 * - Buttons expand equally to fill available width (can be controlled via className)
 *
 * Width can be controlled via the className prop (e.g., w-full, w-64, max-w-md).
 *
 * @param children - Button elements to be grouped together
 * @param className - Additional CSS classes for the container (supports width, flex, and layout classes)
 *
 * @example
 * ```tsx
 * <ButtonGroup className="w-full">
 *   <Button variant="outline">Left</Button>
 *   <Button variant="outline">Middle</Button>
 *   <Button variant="outline">Right</Button>
 * </ButtonGroup>
 * ```
 *
 * @example
 * ```tsx
 * <ButtonGroup className="w-64">
 *   <Button size="sm">Small</Button>
 *   <Button size="sm">Buttons</Button>
 * </ButtonGroup>
 * ```
 *
 * @example
 * ```tsx
 * <ButtonGroup className="justify-center max-w-md">
 *   <Button variant="default">Active</Button>
 *   <Button variant="outline">Inactive</Button>
 *   <Button variant="outline">Inactive</Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div
      className={cn(
        'flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse',
        className,
      )}
    >
      {childrenArray.map((child, index) => {
        if (React.isValidElement(child)) {
          const isFirst = index === 0;
          const isLast = index === childrenArray.length - 1;
          let buttonClass = 'rounded-none shadow-none focus-visible:z-10';

          if (isFirst) {
            buttonClass += ' rounded-s-md';
          }

          if (isLast) {
            buttonClass += ' rounded-e-md';
          }

          const element = child as React.ReactElement<{ className?: string }>;

          return React.cloneElement(element, {
            className: cn(
              element.props.className,
              buttonClass,
              'flex-1 shrink-0', // Allow buttons to expand but prevent shrinking below content
            ),
          });
        }

        return child;
      })}
    </div>
  );
};
