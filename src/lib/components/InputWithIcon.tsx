import type { InputProps } from "@chakra-ui/react";
import {
  InputLeftElement,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { AmpEvent, track } from "lib/amplitude";

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

const iconHeight = (size: InputProps["size"]) => {
  switch (size) {
    case "md":
    case "sm":
      return "40px";
    case "lg":
      return "56px";
    default:
      return "56px";
  }
};
const InputWithIcon = ({
  placeholder,
  value,
  size,
  my,
  action,
  iconPosition = "start",
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
      onClick={
        action ? () => track(AmpEvent.USE_SEARCH_INPUT, { action }) : undefined
      }
    />
    {iconPosition === "end" ? (
      <InputRightElement h={iconHeight(size)} alignItems="center" mr={1}>
        <SearchIcon />
      </InputRightElement>
    ) : (
      <InputLeftElement h={iconHeight(size)} alignItems="center">
        <SearchIcon />
      </InputLeftElement>
    )}
  </InputGroup>
);

export default InputWithIcon;
