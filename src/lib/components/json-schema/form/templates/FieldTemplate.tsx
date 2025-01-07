/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from "@chakra-ui/react";
import type {
  FieldTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import { getTemplate, getUiOptions } from "@rjsf/utils";

/** The `FieldTemplate` component is the template used by `SchemaField` to render any field. It renders the field
 * content, (label, description, children, errors and help) inside of a `WrapIfAdditional` component.
 *
 * @param props - The `FieldTemplateProps` for this component
 */
export default function FieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: FieldTemplateProps<T, S, F>) {
  const {
    children,
    classNames,
    disabled,
    // errors,
    help,
    hidden,
    id,
    label,
    onDropPropertyClick,
    onKeyChange,
    rawErrors = [],
    readonly,
    registry,
    required,
    schema,
    uiSchema,
  } = props;
  const uiOptions = getUiOptions(uiSchema);
  const WrapIfAdditionalTemplate = getTemplate<
    "WrapIfAdditionalTemplate",
    T,
    S,
    F
  >("WrapIfAdditionalTemplate", registry, uiOptions);
  if (hidden) {
    return <div style={{ display: "none" }}>{children}</div>;
  }
  return (
    <WrapIfAdditionalTemplate
      id={id}
      classNames={classNames}
      disabled={disabled}
      label={label}
      registry={registry}
      required={required}
      schema={schema}
      uiSchema={uiSchema}
      onDropPropertyClick={onDropPropertyClick}
      onKeyChange={onKeyChange}
      readonly={readonly}
    >
      <FormControl
        isInvalid={rawErrors && rawErrors.length > 0}
        isRequired={required && !readonly}
      >
        {children}
        {/* {errors} */}
        {help}
      </FormControl>
    </WrapIfAdditionalTemplate>
  );
}
