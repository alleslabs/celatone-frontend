import type { SystemStyleObject } from "@chakra-ui/styled-system";
import type { Props } from "chakra-react-select";
import { Select } from "chakra-react-select";

type SelectInputOptionValue = object | string | boolean | null;

export interface SelectInputOption<OptionValue extends SelectInputOptionValue> {
  label: string;
  value: OptionValue;
  isDisabled?: boolean;
}

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
  options,
  value,
  onChange,
  size = "lg",
  placeholder,
  menuPortalTarget,
  isSearchable,
  formatOptionLabel,
  components,
  chakraStyles,
  inputId,
  name,
  isMulti,
  closeMenuOnSelect,
  onBlur,
  onFocus,
  autoFocus,
  classNamePrefix,
}: SelectInputProps<OptionValue, IsMulti>) => (
  <Select<SelectInputOption<OptionValue>, IsMulti>
    menuPosition="fixed"
    menuPortalTarget={menuPortalTarget}
    placeholder={placeholder}
    options={options}
    value={value}
    onChange={onChange}
    size={size}
    filterOption={handleFilterOption}
    formatOptionLabel={formatOptionLabel}
    components={components}
    isSearchable={isSearchable}
    chakraStyles={{
      container: (provided: SystemStyleObject) => ({
        ...provided,
        width: "100%",
      }),
      valueContainer: (provided: SystemStyleObject) => ({
        ...provided,
        pl: 3,
        pr: 0,
      }),
      dropdownIndicator: (provided: SystemStyleObject) => ({
        ...provided,
        px: 2,
        color: "gray.600",
      }),
      placeholder: (provided: SystemStyleObject) => ({
        ...provided,
        color: "gray.500",
        fontSize: "14px",
        whiteSpace: "nowrap",
      }),
      option: (provided) => ({
        ...provided,
        color: "text.main",
        fontSize: "16px",
        _hover: {
          bg: "gray.700",
        },
        _selected: {
          bg: "gray.800",
        },
      }),
      ...chakraStyles,
    }}
    inputId={inputId}
    name={name}
    isMulti={isMulti}
    closeMenuOnSelect={closeMenuOnSelect}
    onBlur={onBlur}
    onFocus={onFocus}
    autoFocus={autoFocus}
    classNamePrefix={classNamePrefix}
  />
);
