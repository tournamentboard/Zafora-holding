import type { ReactElement } from "react";

declare module "react-hook-form" {
  export type FieldValues = Record<string, unknown>;

  export type FieldPath<TFieldValues extends FieldValues> =
    Extract<keyof TFieldValues, string>;

  export interface ControllerProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  > {
    name: TName;
    control?: unknown;
    render: (props: {
      field: Record<string, unknown>;
      fieldState: Record<string, unknown>;
      formState: Record<string, unknown>;
    }) => ReactElement;
    defaultValue?: unknown;
    rules?: Record<string, unknown>;
    shouldUnregister?: boolean;
  }

  export function Controller<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  >(props: ControllerProps<TFieldValues, TName>): ReactElement;

  export function FormProvider(props: Record<string, unknown>): ReactElement;

  export function useFormContext<
    TFieldValues extends FieldValues = FieldValues,
  >(): {
    getFieldState: (
      name: FieldPath<TFieldValues>,
      formState: Record<string, unknown>
    ) => {
      invalid?: boolean;
      isDirty?: boolean;
      isTouched?: boolean;
      error?: { message?: string };
    };
    formState: Record<string, unknown>;
    [key: string]: unknown;
  };
}
