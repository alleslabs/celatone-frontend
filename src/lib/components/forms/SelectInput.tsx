import type { SystemStyleObject } from "@chakra-ui/styled-system";
import type { Props } from "chakra-react-select";
import { Select } from "chakra-react-select";

export interface SelectInputOption<OptionValue extends SelectInputOptionValue> {
  isDisabled?: boolean;
  label: string;
  value: OptionValue;
}

type SelectInputOptionValue = boolean | null | object | string;

interface SelectInputProps<
  OptionValue extends SelectInputOptionValue,
  IsMulti extends boolean = false,
> extends Props<SelectInputOption<OptionValue>, IsMulti> {}

const handleFilterOption = (
  candidate: { label: string; value: string },
  input: string
) => {
  if (input) {
    return candidate.label.toLowerCase().includes(input.toLowerCase());
  }

  return true;
};

export const SelectInput = <
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
  value,
}: SelectInputProps<OptionValue, IsMulti>) => (
  <Select<SelectInputOption<OptionValue>, IsMulti>
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
        fontSize: "16px",
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
    inputId={inputId}
    isMulti={isMulti}
    isSearchable={isSearchable}
    name={name}
    size={size}
    value={value}
    autoFocus={autoFocus}
    closeMenuOnSelect={closeMenuOnSelect}
    components={components}
    filterOption={handleFilterOption}
    formatOptionLabel={formatOptionLabel}
    menuPortalTarget={menuPortalTarget}
    menuPosition="fixed"
    onBlur={onBlur}
    onChange={onChange}
    onFocus={onFocus}
    options={options}
    placeholder={placeholder}
    classNamePrefix={classNamePrefix}
  />
);
