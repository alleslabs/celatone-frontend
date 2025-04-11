import type { AssetOptionValue } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { TokenImageRenderWithCache } from "lib/components/token";
import { getTokenLabel } from "lib/utils";

import type { SelectInputOption } from "../SelectInput";

export const AssetInputFormatOptionLabel = ({
  label,
  value,
}: SelectInputOption<AssetOptionValue>) => (
  <Flex alignItems="center" gap={2}>
    {!!value.logo && (
      <TokenImageRenderWithCache
        alt={getTokenLabel(value.id, label)}
        height={24}
        src={value.logo}
        width={24}
      />
    )}
    <Text color="text.main" variant="body2">
      {label}
    </Text>
  </Flex>
);
