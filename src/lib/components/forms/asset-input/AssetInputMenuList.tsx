import { Box, Flex, Text } from "@chakra-ui/react";
import type { MenuListProps } from "chakra-react-select";
import { components } from "chakra-react-select";

import type { SelectInputOption } from "../SelectInput";
import type { AssetOptionValue } from "lib/types";

export const AssetInputMenuList = (
  props: MenuListProps<SelectInputOption<AssetOptionValue>>
) => {
  const { children } = props;

  return (
    <Box backgroundColor="gray.900" borderRadius="8px" overflow="hidden">
      <components.MenuList {...props}>
        <Flex justifyContent="space-between" px={3} py={4}>
          <Text variant="body3" color="text.dark">
            Token Name
          </Text>
          <Text variant="body3" color="text.dark">
            Balance
          </Text>
        </Flex>
        {children}
      </components.MenuList>
    </Box>
  );
};
