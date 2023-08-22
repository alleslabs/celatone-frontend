/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from "@chakra-ui/react";
import type { FieldTemplateProps } from "@rjsf/utils";
import { getTemplate, getUiOptions } from "@rjsf/utils";

export default function FieldTemplate<T = any, F = any>(
  props: FieldTemplateProps<T, F>
) {
  const {
    id,
    children,
    classNames,
    disabled,
    hidden,
    label,
    onDropPropertyClick,
    onKeyChange,
    readonly,
    registry,
    required,
    rawErrors = [],
    errors,
    help,
    schema,
    uiSchema,
  } = props;
  const uiOptions = getUiOptions<T, F>(uiSchema);
  const WrapIfAdditionalTemplate = getTemplate<
    "WrapIfAdditionalTemplate",
    T,
    F
  >("WrapIfAdditionalTemplate", registry, uiOptions);

  if (hidden) {
    return <div style={{ display: "none" }}>{children}</div>;
  }

  return (
    <WrapIfAdditionalTemplate
      classNames={classNames}
      disabled={disabled}
      id={id}
      label={label}
      onDropPropertyClick={onDropPropertyClick}
      onKeyChange={onKeyChange}
      readonly={readonly}
      required={required}
      schema={schema}
      uiSchema={uiSchema}
      registry={registry}
    >
      <FormControl
        isRequired={required && !readonly}
        isInvalid={rawErrors && rawErrors.length > 0}
      >
        {children}
        {errors}
        {help}
      </FormControl>
    </WrapIfAdditionalTemplate>
  );
}
