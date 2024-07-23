import { Flex, Text } from "@chakra-ui/react";

import { TokenImageRenderWithCache } from "lib/components/token";
import type { AssetOption } from "lib/types";
import { getTokenLabel } from "lib/utils";

export const AssetInputFormatOptionLabel = (data: AssetOption) => {
  const { logo, label, id } = data;

  return (
    <Flex gap={2} alignItems="center">
      <TokenImageRenderWithCache
        src={String(logo)}
        alt={getTokenLabel(String(id), label)}
        width={24}
        height={24}
      />
      <Text variant="body2" color="text.main">
        {label}
      </Text>
    </Flex>
  );
};
