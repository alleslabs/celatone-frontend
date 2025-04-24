import type { InputProps } from "@chakra-ui/react";

import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { trackSearchInput } from "lib/amplitude";

import { CustomIcon } from "./icon";

interface InputWithIconProps extends InputProps {
  amptrackSection?: string;
}

const InputWithIcon = ({
  amptrackSection,
  my,
  size = "md",
  ...inputProps
}: InputWithIconProps) => (
  <InputGroup my={my}>
    <InputLeftElement alignItems="center" h="full">
      <CustomIcon color="gray.600" name="search" />
    </InputLeftElement>
    <Input
      {...inputProps}
      paddingLeft="36px !important"
      size={size}
      onClick={
        amptrackSection
          ? () =>
              trackSearchInput({
                amptrackSection,
              })
          : undefined
      }
    />
  </InputGroup>
);

export default InputWithIcon;
