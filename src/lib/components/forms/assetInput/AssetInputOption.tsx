import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import type { OptionProps } from "chakra-react-select";
import { components } from "chakra-react-select";

import { TokenImageRenderWithCache } from "lib/components/token";
import type { AssetOption } from "lib/types";
import { getTokenLabel } from "lib/utils";

export const AssetInputOption = (props: OptionProps<AssetOption>) => {
  const { data, isSelected } = props;
  const textMainColor =
    data.isDisabled && !isSelected ? "text.disabled" : "text.main";

  return (
    <Box
      sx={{
        position: "relative",
        "> div": {
          background: isSelected ? "gray.800" : "gray.900",
          "&:hover": {
            background:
              data.isDisabled && !isSelected ? "gray.900" : "gray.800",
          },
        },
      }}
    >
      <components.Option {...props}>
        {isSelected && (
          <Grid
            position="absolute"
            top={0}
            left={0}
            bottom={0}
            placeItems="center"
          >
            <Box w={1} height={8} background="primary.main" borderRadius={8} />
          </Grid>
        )}
        <Flex justifyContent="space-between" alignItems="center">
          <Flex gap={2} alignItems="center">
            <Box opacity={data.isDisabled && !isSelected ? 0.6 : 1}>
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
