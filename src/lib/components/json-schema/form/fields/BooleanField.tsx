/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  EnumOptionsType,
  FieldProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";

import { getUiOptions, getWidget, optionsList } from "@rjsf/utils";
import isObject from "lodash/isObject";

/** The `BooleanField` component is used to render a field in the schema is boolean. It constructs `enumOptions` for the
 * two boolean values based on the various alternatives in the schema.
 *
 * @param props - The `FieldProps` for this template
 */
function BooleanField<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: FieldProps<T, S, F>) {
  const {
    autofocus,
    disabled,
    formData,
    hideError,
    idSchema,
    name,
    onBlur,
    onChange,
    onFocus,
    rawErrors,
    readonly,
    registry,
    required,
    schema,
    title,
    uiSchema,
  } = props;
  const { title: schemaTitle } = schema;
  const { formContext, globalUiOptions, widgets } = registry;
  const {
    // Unlike the other fields, don't use `getDisplayLabel()` since it always returns false for the boolean type
    label: displayLabel = true,
    title: uiTitle,
    widget = "select",
    ...options
  } = getUiOptions<T, S, F>(uiSchema, globalUiOptions);

  const Widget = getWidget(schema, widget, widgets);

  let enumOptions: EnumOptionsType<S>[] | undefined;
  const label = uiTitle ?? schemaTitle ?? title ?? name;
  if (Array.isArray(schema.oneOf)) {
    enumOptions = optionsList<S>({
      oneOf: schema.oneOf
        .map((option) => {
          if (isObject(option)) {
            return {
              ...option,
              title: option.title || (option.const === true ? "True" : "False"),
            };
          }
          return undefined;
        })
        .filter((o: any) => o) as S[], // cast away the error that typescript can't grok is fixed
    } as unknown as S);
  } else {
    // We deprecated enumNames in v5. It's intentionally omitted from RSJFSchema type, so we need to cast here.
    const schemaWithEnumNames = schema as S & { enumNames?: string[] };
    const enums = schema.enum ?? [true, false];
    if (
      !schemaWithEnumNames.enumNames &&
      enums.length === 2 &&
      enums.every((v: any) => typeof v === "boolean")
    ) {
      enumOptions = [
        {
          label: enums[0] ? "True" : "False",
          value: enums[0],
        },
        {
          label: enums[1] ? "True" : "False",
          value: enums[1],
        },
      ];
    } else {
      enumOptions = optionsList<S>({
        enum: enums,
        // NOTE: enumNames is deprecated, but still supported for now.
        enumNames: schemaWithEnumNames.enumNames,
      } as unknown as S);
    }
  }

  if (!required)
    enumOptions = [...(enumOptions ?? []), { label: "null", value: null }];

  return (
    <Widget
      id={idSchema.$id}
      autofocus={autofocus}
      disabled={disabled}
      formContext={formContext}
      hideError={hideError}
      hideLabel={!displayLabel}
      label={label}
      name={name}
      options={{ ...options, enumOptions }}
      placeholder={readonly ? undefined : "Select boolean option"}
      rawErrors={rawErrors}
      readonly={readonly}
      registry={registry}
      required={required}
      schema={schema}
      uiSchema={uiSchema}
      value={formData}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onFocus}
    />
  );
}

export default BooleanField;
