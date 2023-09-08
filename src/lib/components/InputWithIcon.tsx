import type { InputProps } from "@chakra-ui/react";
import {
  InputLeftElement,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { CustomIcon } from "./icon";

interface InputWithIconProps {
  placeholder: string;
  value: string;
  size?: InputProps["size"];
  my?: InputProps["my"];
  autoFocus?: boolean;
  action?: string;
  iconPosition?: "start" | "end";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SearchIcon = () => <CustomIcon name="search" color="gray.600" />;

const InputWithIcon = ({
  placeholder,
  value,
  size,
  my,
  action,
  iconPosition = "end",
  autoFocus = false,
  onChange,
}: InputWithIconProps) => (
  <InputGroup my={my}>
    <Input
      placeholder={placeholder}
      value={value}
      size={size}
      p={`8px ${iconPosition === "end" ? "40px" : "12px"} 8px ${
        iconPosition === "start" ? "40px" : "12px"
      } !important`}
      onChange={onChange}
      autoFocus={autoFocus}
      onClick={action ? () => AmpTrack(AmpEvent.USE_SEARCH_INPUT) : undefined}
    />
    {iconPosition === "end" ? (
      <InputRightElement
        h={size === "lg" ? "56px" : "full"}
        alignItems="center"
        mr={1}
      >
        <SearchIcon />
      </InputRightElement>
    ) : (
      <InputLeftElement h={size === "lg" ? "56px" : "full"} alignItems="center">
        <SearchIcon />
      </InputLeftElement>
    )}
  </InputGroup>
);

export default InputWithIcon;
