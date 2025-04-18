import type { SystemStyleObject } from "@chakra-ui/styled-system";
import type { Props } from "chakra-react-select";

import { Stack, Text } from "@chakra-ui/react";
import { Select } from "chakra-react-select";

type SelectInputOptionValue = object | string | boolean | number | null;

export interface SelectInputOption<OptionValue extends SelectInputOptionValue> {
  label: string;
  value: OptionValue;
  isDisabled?: boolean;
}

interface SelectInputProps<
  OptionValue extends SelectInputOptionValue,
  IsMulti extends boolean = false,
> extends Props<SelectInputOption<OptionValue>, IsMulti> {
  label?: string;
  labelBg?: string;
  isRequired?: boolean;
}

const handleFilterOption = (
  candidate: { label: string; value: string },
  input: string
) => {
  if (input) {
    return candidate.label.toLowerCase().includes(input.toLowerCase());
  }

  return true;
};

export const SelectInputBody = <
  OptionValue extends SelectInputOptionValue,
  IsMulti extends boolean = false,
>({
  autoFocus,
  chakraStyles,
  classNamePrefix,
  closeMenuOnSelect,
  components,
  formatOptionLabel,
  inputId,
  isDisabled,
  isMulti,
  isSearchable,
  menuPortalTarget,
  name,
  onBlur,
  onChange,
  onFocus,
  options,
  placeholder,
  size = "lg",
  value = null,
}: SelectInputProps<OptionValue, IsMulti>) => (
  <Select<SelectInputOption<OptionValue>, IsMulti>
    autoFocus={autoFocus}
    chakraStyles={{
      container: (provided: SystemStyleObject) => ({
        ...provided,
        width: "100%",
      }),
      dropdownIndicator: (provided: SystemStyleObject) => ({
        ...provided,
        color: "gray.600",
        px: 2,
      }),
      option: (provided) => ({
        ...provided,
        _hover: {
          bg: "gray.700",
        },
        _selected: {
          bg: "gray.800",
        },
        color: "text.main",
        fontSize: size === "sm" ? "14px" : "16px",
      }),
      placeholder: (provided: SystemStyleObject) => ({
        ...provided,
        color: "gray.500",
        fontSize: "14px",
        whiteSpace: "nowrap",
      }),
      valueContainer: (provided: SystemStyleObject) => ({
        ...provided,
        pl: 3,
        pr: 0,
      }),
      ...chakraStyles,
    }}
    classNamePrefix={classNamePrefix}
    closeMenuOnSelect={closeMenuOnSelect}
    components={components}
    filterOption={handleFilterOption}
    formatOptionLabel={formatOptionLabel}
    inputId={inputId}
    isDisabled={isDisabled}
    isMulti={isMulti}
    isSearchable={isSearchable}
    menuPortalTarget={menuPortalTarget}
    menuPosition="fixed"
    name={name}
    options={options}
    placeholder={placeholder}
    size={size}
    styles={{
      menuPortal: (provided) => ({
        ...provided,
        zIndex: 2,
      }),
    }}
    value={value}
    onBlur={onBlur}
    onChange={onChange}
    onFocus={onFocus}
  />
);

export const SelectInput = <
  OptionValue extends SelectInputOptionValue,
  IsMulti extends boolean = false,
>({
  isDisabled,
  isRequired,
  label,
  labelBg = "background.main",
  ...options
}: SelectInputProps<OptionValue, IsMulti>) =>
  label ? (
    <Stack position="relative">
      <Text
        className="form-label"
        sx={{
          "::after": {
            color: "error.main",
            content: isRequired ? '"* (Required)"' : '""',
            ml: 1,
          },
          bg: labelBg,
          color: "text.dark",
          fontSize: "12px",
          letterSpacing: "0.15px",
          ml: 3,
          opacity: isDisabled ? 0.3 : 1,
          position: "absolute",
          px: 1,
          top: -2,
          zIndex: 1,
        }}
      >
        {label}
      </Text>
      <SelectInputBody {...options} />
    </Stack>
  ) : (
    <SelectInputBody {...options} />
  );
