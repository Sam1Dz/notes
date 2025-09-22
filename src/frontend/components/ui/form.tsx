'use client';

import type * as LabelPrimitive from '@radix-ui/react-label';

import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { Label } from '~/frontend/components/ui/label';
import { cn } from '~/utils/core/class-merger';

/**
 * Form provider component from react-hook-form.
 * Provides form context to child components.
 */
export const Form = FormProvider;

/**
 * Context value for form field state management.
 */
interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

/**
 * Form field component that provides field context and renders a Controller.
 * Must be used within a Form component and wraps individual form inputs.
 *
 * @param props - Controller props from react-hook-form
 * @returns JSX element with field context provider
 */
export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

/**
 * Hook to access form field state and context.
 * Must be used within a FormField component.
 *
 * @returns Object containing field state, IDs, and form context
 */
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

/**
 * Context value for form item state management.
 */
interface FormItemContextValue {
  id: string;
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

/**
 * Form item container component that provides layout and context for form fields.
 * Should wrap FormLabel, FormControl, FormDescription, and FormMessage components.
 *
 * @param className - Additional CSS classes
 * @param props - Additional div props
 * @returns JSX div element with form item context
 */
export function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        className={cn('grid gap-2', className)}
        data-slot="form-item"
        {...props}
      />
    </FormItemContext.Provider>
  );
}

/**
 * Form label component that automatically handles error states and accessibility.
 * Must be used within a FormField component.
 *
 * @param className - Additional CSS classes
 * @param isRequired - Whether the field is required, displays an asterisk if true
 * @param props - Additional label props
 * @returns JSX label element with error styling and accessibility attributes
 */
export function FormLabel({
  className,
  isRequired,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  isRequired?: boolean;
}) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      className={cn('data-[error=true]:text-error gap-1', className)}
      data-error={!!error}
      data-slot="form-label"
      htmlFor={formItemId}
      {...props}
    >
      {props.children}
      {isRequired && <span className="text-error">*</span>}
    </Label>
  );
}

/**
 * Form control component that provides accessibility attributes and error handling.
 * Must be used within a FormField component and should wrap the actual form input.
 *
 * @param props - Slot props for rendering different elements
 * @returns JSX element with accessibility attributes for form controls
 */
export function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      data-slot="form-control"
      id={formItemId}
      {...props}
    />
  );
}

/**
 * Form description component for providing additional context about form fields.
 * Must be used within a FormField component.
 *
 * @param className - Additional CSS classes
 * @param props - Additional paragraph props
 * @returns JSX paragraph element with description styling
 */
export function FormDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      className={cn('text-muted-foreground text-sm', className)}
      data-slot="form-description"
      id={formDescriptionId}
      {...props}
    />
  );
}

/**
 * Form message component for displaying validation errors or custom messages.
 * Must be used within a FormField component.
 * Automatically displays error messages from form validation.
 *
 * @param className - Additional CSS classes
 * @param props - Additional paragraph props
 * @returns JSX paragraph element with error styling, or null if no message
 */
export function FormMessage({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      className={cn('text-error text-sm', className)}
      data-slot="form-message"
      id={formMessageId}
      {...props}
    >
      {body}
    </p>
  );
}
