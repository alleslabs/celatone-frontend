import { Box, Text } from "@chakra-ui/react";
import type { OptionProps } from "chakra-react-select";
import { components } from "chakra-react-select";

import type { VerifyPublishCodeOpiton } from "./verifyPublishCodeSelectInput";

export const VerifyPublishCodeInputOption = (
  props: OptionProps<VerifyPublishCodeOpiton>
) => {
  const { isSelected, data } = props;

  return (
    <Box
      sx={{
        "> div": {
          background: isSelected ? "gray.800" : "gray.900",
          "&:hover": {
            background: "gray.800",
          },
        },
      }}
    >
      <components.Option {...props}>
        <Text variant="body2">{data.label}</Text>
      </components.Option>
    </Box>
  );
};
