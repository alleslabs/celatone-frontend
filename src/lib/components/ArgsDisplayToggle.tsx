import { Flex, Text } from "@chakra-ui/react";

import type { SelectInputOption } from "./forms";

import { SelectInput } from "./forms";

const options: SelectInputOption<string>[] = [
  {
    label: "Decoded",
    value: "decoded",
  },
  {
    label: "Raw",
    value: "raw",
  },
];

interface ArgsDisplayToggleProps {
  onChange: (value: string | undefined) => void;
  title: string;
  value: string | undefined;
}

export const ArgsDisplayToggle = ({
  onChange,
  title,
  value,
}: ArgsDisplayToggleProps) => (
  <Flex align="center" gap={2}>
    <Text color="text.dark" variant="body2">
      {title}
    </Text>
    <SelectInput
      classNamePrefix="chakra-react-select"
      isSearchable={false}
      menuPortalTarget={
        typeof window !== "undefined" ? document.body : undefined
      }
      options={options}
      placeholder=""
      size="sm"
      value={options.find(({ value: optionValue }) => optionValue === value)}
      onChange={(newValue) => onChange(newValue?.value)}
    />
  </Flex>
);
