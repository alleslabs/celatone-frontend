import type { MenuListProps } from "chakra-react-select";
import type { AssetOptionValue } from "lib/types";

import { Box, Flex, Text } from "@chakra-ui/react";
import { components } from "chakra-react-select";

import type { SelectInputOption } from "../SelectInput";

export const AssetInputMenuList = (
  props: MenuListProps<SelectInputOption<AssetOptionValue>>
) => {
  const { children } = props;

  return (
    <Box backgroundColor="gray.900" borderRadius="8px" overflow="hidden">
      <components.MenuList {...props}>
        <Flex justifyContent="space-between" px={3} py={4}>
          <Text variant="body3" color="text.dark">
            Token name
          </Text>
          <Text color="text.dark" variant="body3">
            Balance
          </Text>
        </Flex>
        {children}
      </components.MenuList>
    </Box>
  );
};
