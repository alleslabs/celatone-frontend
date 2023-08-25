/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormControl, FormLabel, Text } from "@chakra-ui/react";
import type { WidgetProps } from "@rjsf/utils";
import { getTemplate } from "@rjsf/utils";
import type { ChangeEvent, FocusEvent } from "react";

export default function CheckboxWidget<T = any, F = any>(
  props: WidgetProps<T, F>
) {
  const {
    id,
    value,
    disabled,
    readonly,
    required,
    onChange,
    onBlur,
    onFocus,
    label,
    hideLabel,
    registry,
    options,
    schema,
    uiSchema,
  } = props;
  const DescriptionFieldTemplate = getTemplate<
    "DescriptionFieldTemplate",
    T,
    F
  >("DescriptionFieldTemplate", registry, options);
  const description = options.description || schema.description;

  const { schemaUtils } = registry;
  const displayLabel =
    schemaUtils.getDisplayLabel(schema, uiSchema) &&
    (!!label || !!schema.title);

  const handleOnChange = ({
    target: { checked },
  }: ChangeEvent<HTMLInputElement>) => onChange(checked);
  const handleOnBlur = ({
    target: { value: newValue },
  }: FocusEvent<HTMLInputElement | any>) => onBlur(id, newValue);
  const handleOnFocus = ({
    target: { value: newValue },
  }: FocusEvent<HTMLInputElement | any>) => onFocus(id, newValue);

  return (
    <FormControl mb={1} isRequired={required}>
      {displayLabel && (
        <FormLabel
          htmlFor={id}
          id={`${id}-label`}
          fontSize="12px"
          fontWeight={700}
          marginInlineEnd={1}
          alignItems="center"
          _disabled={{
            color: "text.main",
          }}
        >
          {label}
        </FormLabel>
      )}
      {!hideLabel && !!description && (
        <DescriptionFieldTemplate
          id={`${id}-description`}
          description={description}
          registry={registry}
        />
      )}
      <Checkbox
        id={id}
        name={id}
        required={required}
        isChecked={typeof value === "undefined" ? false : value}
        isReadOnly={disabled || readonly}
        cursor={disabled || readonly ? "not-allowed" : "pointer"}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        h={6}
      >
        <Text variant="body2">
          {typeof value === "undefined" ? `false` : `${value}`}
        </Text>
      </Checkbox>
    </FormControl>
  );
}
