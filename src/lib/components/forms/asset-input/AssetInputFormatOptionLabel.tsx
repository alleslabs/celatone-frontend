import { Flex, Text } from "@chakra-ui/react";

import { TokenImageRenderWithCache } from "lib/components/token";
import type { AssetOptionValue } from "lib/types";
import { getTokenLabel } from "lib/utils";
import type { SelectInputOption } from "../SelectInput";

export const AssetInputFormatOptionLabel = ({
  label,
  value,
}: SelectInputOption<AssetOptionValue>) => (
  <Flex gap={2} alignItems="center">
    {!!value.logo && (
      <TokenImageRenderWithCache
        src={value.logo}
        alt={getTokenLabel(value.id, label)}
        width={24}
        height={24}
      />
    )}
    <Text variant="body2" color="text.main">
      {label}
    </Text>
  </Flex>
);
