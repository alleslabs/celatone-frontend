import { SearchIcon } from "@chakra-ui/icons";
import type { InputProps } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

interface InputWithIconProps {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  size?: InputProps["size"];
}

const InputWithIcon = ({
  placeholder,
  value,
  size,
  onChange,
}: InputWithIconProps) => (
  <InputGroup>
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      size={size}
    />
    <InputRightElement h="56px" alignItems="center">
      <SearchIcon color="gray.600" />
    </InputRightElement>
  </InputGroup>
);

export default InputWithIcon;
