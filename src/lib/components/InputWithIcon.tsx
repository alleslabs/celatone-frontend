import type { InputProps } from "@chakra-ui/react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { CustomIcon } from "./icon";

interface InputWithIconProps {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  size?: InputProps["size"];
  autoFocus?: boolean;
  action?: string;
}

const InputWithIcon = ({
  placeholder,
  value,
  size,
  action,
  autoFocus = false,
  onChange,
}: InputWithIconProps) => (
  <InputGroup>
    <InputLeftElement h={size === "lg" ? "56px" : "full"} alignItems="center">
      <CustomIcon name="search" color="gray.600" />
    </InputLeftElement>
    <Input
      pl={9}
      placeholder={placeholder}
      value={value}
      size={size}
      autoFocus={autoFocus}
      onChange={onChange}
      onClick={action ? () => AmpTrack(AmpEvent.USE_SEARCH_INPUT) : undefined}
    />
  </InputGroup>
);

export default InputWithIcon;
