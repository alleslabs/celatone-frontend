import type { InputProps } from "@chakra-ui/react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";

import { CustomIcon } from "./icon";

interface InputWithIconProps extends InputProps {
  amptrackSection?: string;
}

const InputWithIcon = ({
  my,
  size = "md",
  amptrackSection,
  ...inputProps
}: InputWithIconProps) => (
  <InputGroup my={my}>
    <InputLeftElement h="full" alignItems="center">
      <CustomIcon name="search" color="gray.600" />
    </InputLeftElement>
    <Input
      {...inputProps}
      size={size}
      paddingLeft="36px !important"
      onClick={
        amptrackSection
          ? () => track(AmpEvent.USE_SEARCH_INPUT, { amptrackSection })
          : undefined
      }
    />
  </InputGroup>
);

export default InputWithIcon;
