import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import type { OptionProps } from "chakra-react-select";
import { components } from "chakra-react-select";

import type { SelectInputOption } from "../SelectInput";
import { TokenImageRenderWithCache } from "lib/components/token";
import type { AssetOptionValue } from "lib/types";
import { getTokenLabel } from "lib/utils";

export const AssetInputOption = (
  props: OptionProps<SelectInputOption<AssetOptionValue>>
) => {
  const { data, isSelected } = props;
  const textMainColor =
    data.isDisabled && !isSelected ? "text.disabled" : "text.main";

  return (
    <Box
      sx={{
        "> div": {
          "&:hover": {
            background:
              data.isDisabled && !isSelected ? "gray.900" : "gray.800",
          },
          background: isSelected ? "gray.800" : "gray.900",
        },
        position: "relative",
      }}
    >
      <components.Option {...props}>
        {isSelected && (
          <Grid
            left={0}
            placeItems="center"
            bottom={0}
            position="absolute"
            top={0}
          >
            <Box height={8} w={1} background="primary.main" borderRadius={8} />
          </Grid>
        )}
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" gap={2}>
            {!!data.value.logo && (
              <Box opacity={data.isDisabled && !isSelected ? 0.6 : 1}>
                <TokenImageRenderWithCache
                  width={24}
                  alt={getTokenLabel(data.value.id, data.label)}
                  height={24}
                  src={data.value.logo}
                />
              </Box>
            )}
            <Text variant="body2" color={textMainColor}>
              {data.label}
            </Text>
          </Flex>
          <Flex alignItems="flex-end" direction="column">
            <Text variant="body2" color={textMainColor}>
              {data.value.formatted || "0.000000"}
            </Text>
            <Text
              variant="body3"
              color={data.isDisabled ? "text.disabled" : "text.dark"}
            >
              {`(${data.value.price || "$0.00"})`}
            </Text>
          </Flex>
        </Flex>
      </components.Option>
    </Box>
  );
};
