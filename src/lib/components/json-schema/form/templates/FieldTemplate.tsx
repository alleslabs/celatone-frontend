/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from "@chakra-ui/react";
import type { FieldTemplateProps } from "@rjsf/utils";
import { getTemplate, getUiOptions } from "@rjsf/utils";
import { useEffect } from "react";

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
    formData,
    onChange,
  } = props;
  const uiOptions = getUiOptions<T, F>(uiSchema);
  const WrapIfAdditionalTemplate = getTemplate<
    "WrapIfAdditionalTemplate",
    T,
    F
  >("WrapIfAdditionalTemplate", registry, uiOptions);

  useEffect(() => {
    if (required && formData === undefined) {
      if (schema.type === "array") onChange([] as T);
      else if (schema.type === "boolean") onChange(false as T);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(formData), onChange, required, schema.type]);

  return hidden ? (
    <div style={{ display: "none" }}>{children}</div>
  ) : (
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
