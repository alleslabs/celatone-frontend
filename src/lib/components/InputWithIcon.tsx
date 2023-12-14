import type { InputProps } from "@chakra-ui/react";
import { InputLeftElement, Input, InputGroup } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { AmpEvent, track } from "lib/amplitude";

import { CustomIcon } from "./icon";

interface InputWithIconProps {
  placeholder: string;
  value: string;
  size?: InputProps["size"];
  my?: InputProps["my"];
  autoFocus?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  amptrackSection?: string;
}

const InputWithIcon = ({
  placeholder,
  value,
  size = "md",
  my,
  autoFocus = false,
  onChange,
  amptrackSection,
}: InputWithIconProps) => (
  <InputGroup my={my}>
    <InputLeftElement h="full" alignItems="center">
      <CustomIcon name="search" color="gray.600" />
    </InputLeftElement>
    <Input
      placeholder={placeholder}
      value={value}
      size={size}
      paddingLeft="36px !important"
      onChange={onChange}
      autoFocus={autoFocus}
      onClick={
        amptrackSection
          ? () => track(AmpEvent.USE_SEARCH_INPUT, { amptrackSection })
          : undefined
      }
    />
  </InputGroup>
);

export default InputWithIcon;
