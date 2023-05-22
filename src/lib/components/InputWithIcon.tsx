import type { InputProps } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { CustomIcon } from "./icon";

interface InputWithIconProps {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  size?: InputProps["size"];
  action?: string;
}

const InputWithIcon = ({
  placeholder,
  value,
  size,
  action,
  onChange,
}: InputWithIconProps) => (
  <InputGroup>
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      size={size}
      onClick={action ? () => AmpTrack(AmpEvent.USE_SEARCH_INPUT) : undefined}
    />
    <InputRightElement h="56px" alignItems="center" mr="1">
      <CustomIcon name="search" color="gray.600" />
    </InputRightElement>
  </InputGroup>
);

export default InputWithIcon;
