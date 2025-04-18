/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  EnumOptionsType,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from "@rjsf/utils";
import type React from "react";

import { FormControl } from "@chakra-ui/react";
import {
  descriptionId,
  enumOptionsIndexForValue,
  enumOptionsValueForIndex,
  getTemplate,
} from "@rjsf/utils";
import { SelectInput } from "lib/components/forms";

/**
 * chakra-react-select option base.
 */
interface OptionBase {
  variant?: string;
  colorScheme?: string;
  isFixed?: boolean;
  isDisabled?: boolean;
}

export interface SelectOptionBase<T = unknown> extends OptionBase {
  label: string;
  value: T;
}

/**
 * Custom select for use with the react-jsonschema-form.
 * We do not create custom options because the entire library depends on the value being a number.
 * @param props
 * @todo Multi select
 */
const SelectWidget = <
  T,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(
  props: WidgetProps<T, S, F>
) => {
  const {
    autofocus,
    disabled,
    id,
    multiple,
    onBlur,
    onChange,
    onFocus,
    options,
    placeholder = "",
    readonly,
    // rawErrors = [],
    registry,
    required,
    schema,
    value,
  } = props;
  const { emptyValue, enumDisabled, enumOptions } = options;

  const DescriptionFieldTemplate = getTemplate<
    "DescriptionFieldTemplate",
    T,
    S,
    F
  >("DescriptionFieldTemplate", registry, options);

  const handleOnMultiChange = (e: any) =>
    onChange(
      enumOptionsValueForIndex<S>(
        e.map((v: { value: any }) => {
          return v.value;
        }),
        enumOptions,
        emptyValue
      )
    );

  const handleOnChange = (e: any) =>
    onChange(enumOptionsValueForIndex<S>(e.value, enumOptions, emptyValue));

  const handleOnBlur = ({ target }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(
      id,
      enumOptionsValueForIndex<S>(target.value, enumOptions, emptyValue)
    );

  const handleOnFocus = ({ target }: React.FocusEvent<HTMLInputElement>) =>
    onFocus(
      id,
      enumOptionsValueForIndex<S>(target.value, enumOptions, emptyValue)
    );

  const valueLabelMap: any = {};
  const displayEnumOptions = Array.isArray(enumOptions)
    ? enumOptions.map((option: EnumOptionsType<S>, index: number) => {
        const { label: optionLabel, value: optionValue } = option;
        valueLabelMap[index] = optionLabel || String(optionValue);
        return {
          isDisabled:
            Array.isArray(enumDisabled) &&
            enumDisabled.indexOf(optionValue) !== -1,
          label: optionLabel,
          value: String(index),
        };
      })
    : [];

  const isMultiple =
    typeof multiple !== "undefined" &&
    multiple !== false &&
    Boolean(enumOptions);
  const selectedIndex = enumOptionsIndexForValue<S>(
    value,
    enumOptions,
    isMultiple
  );
  const formValue: any = isMultiple
    ? ((selectedIndex as string[]) || []).map((i: string) => {
        return {
          label: valueLabelMap[i],
          value: i,
        };
      })
    : {
        label: valueLabelMap[selectedIndex as string] || "",
        selectedIndex,
      };

  return (
    <FormControl
      isDisabled={disabled || readonly}
      isReadOnly={readonly}
      isRequired={required && !readonly}
      my={2}
      // isInvalid={rawErrors && rawErrors.length > 0}
      sx={{ "& > p": { mb: 2, mt: 4 } }}
    >
      {!!schema.description && (
        <DescriptionFieldTemplate
          id={descriptionId<T>(id)}
          description={schema.description}
          registry={registry}
          schema={schema}
        />
      )}
      <SelectInput
        autoFocus={autofocus}
        closeMenuOnSelect={!isMultiple}
        inputId={id}
        isMulti={isMultiple}
        menuPortalTarget={document.body}
        name={id}
        options={displayEnumOptions}
        placeholder={
          placeholder.length > 0 || readonly ? placeholder : "Select option"
        }
        size="md"
        value={selectedIndex === undefined ? undefined : formValue}
        onBlur={handleOnBlur}
        onChange={isMultiple ? handleOnMultiChange : handleOnChange}
        onFocus={handleOnFocus}
      />
    </FormControl>
  );
};

export default SelectWidget;
