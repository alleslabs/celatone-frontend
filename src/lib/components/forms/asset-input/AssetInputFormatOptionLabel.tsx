import { Flex, Text } from "@chakra-ui/react";

import type { SelectInputOption } from "../SelectInput";
import { TokenImageRenderWithCache } from "lib/components/token";
import type { AssetOptionValue } from "lib/types";
import { getTokenLabel } from "lib/utils";

export const AssetInputFormatOptionLabel = ({
  label,
  value,
}: SelectInputOption<AssetOptionValue>) => (
  <Flex alignItems="center" gap={2}>
    {!!value.logo && (
      <TokenImageRenderWithCache
        width={24}
        alt={getTokenLabel(value.id, label)}
        height={24}
        src={value.logo}
      />
    )}
    <Text variant="body2" color="text.main">
      {label}
    </Text>
  </Flex>
);
