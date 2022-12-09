import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

interface InputWithIconProps {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputWithIcon = ({
  placeholder,
  value,
  onChange,
}: InputWithIconProps) => {
  return (
    <InputGroup>
      <Input placeholder={placeholder} value={value} onChange={onChange} />
      <InputRightElement>
        <SearchIcon color="input.main" />
      </InputRightElement>
    </InputGroup>
  );
};

export default InputWithIcon;
