import { Box, Flex, Text } from "@chakra-ui/react";
import type { OptionProps } from "chakra-react-select";
import { components } from "chakra-react-select";

import { TokenImageRenderWithCache } from "lib/components/token";
import { getTokenLabel } from "lib/utils";

import type { AssetOption } from "./AssetInput";

export const AssetInputOption = (props: OptionProps<AssetOption>) => {
  const { data } = props;
  const textMainColor = data.isDisabled ? "text.disabled" : "text.main";

  return (
    <Box
      sx={{
        "> div": {
          background: "gray.900",
          "&:hover": {
            background: "gray.800",
          },
        },
      }}
    >
      <components.Option {...props}>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex gap={2} alignItems="center">
            <Box opacity={data.isDisabled ? 0.6 : 1}>
              <TokenImageRenderWithCache
                src={String(data.logo)}
                alt={getTokenLabel(String(data.id), data.label)}
                width={24}
                height={24}
              />
            </Box>
            <Text variant="body2" color={textMainColor}>
              {data.label}
            </Text>
          </Flex>
          <Flex direction="column" alignItems="flex-end">
            <Text variant="body2" color={textMainColor}>
              {data.formatted || "0.000000"}
            </Text>
            <Text
              variant="body3"
              color={data.isDisabled ? "text.disabled" : "text.dark"}
            >
              {`(${data.price || "$0.00"})`}
            </Text>
          </Flex>
        </Flex>
      </components.Option>
    </Box>
  );
};
