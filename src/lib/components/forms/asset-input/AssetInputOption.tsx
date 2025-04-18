import type { OptionProps } from "chakra-react-select";
import type { AssetOptionValue } from "lib/types";

import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { components } from "chakra-react-select";
import { TokenImageRenderWithCache } from "lib/components/token";
import { getTokenLabel } from "lib/utils";

import type { SelectInputOption } from "../SelectInput";

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
            bottom={0}
            left={0}
            placeItems="center"
            position="absolute"
            top={0}
          >
            <Box background="primary.main" borderRadius={8} height={8} w={1} />
          </Grid>
        )}
        <Flex alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" gap={2}>
            {!!data.value.logo && (
              <Box opacity={data.isDisabled && !isSelected ? 0.6 : 1}>
                <TokenImageRenderWithCache
                  alt={getTokenLabel(data.value.id, data.label)}
                  height={24}
                  src={data.value.logo}
                  width={24}
                />
              </Box>
            )}
            <Text color={textMainColor} variant="body2">
              {data.label}
            </Text>
          </Flex>
          <Flex alignItems="flex-end" direction="column">
            <Text color={textMainColor} variant="body2">
              {data.value.formatted || "0.000000"}
            </Text>
            <Text
              color={data.isDisabled ? "text.disabled" : "text.dark"}
              variant="body3"
            >
              {`(${data.value.price || "$0.00"})`}
            </Text>
          </Flex>
        </Flex>
      </components.Option>
    </Box>
  );
};
