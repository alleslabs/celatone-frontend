import { Flex, Text } from "@chakra-ui/react";

import { Copier } from "../copy";
import { TooltipInfo } from "../Tooltip";
import type { TokenWithValue } from "lib/types";
import { formatTokenWithValue, isSupportedToken } from "lib/utils";

interface MsgTokenProps {
  ampCopierSection?: string;
  fontWeight?: number;
  token: TokenWithValue;
}

export const MsgToken = ({
  ampCopierSection,
  fontWeight = 600,
  token,
}: MsgTokenProps) => (
  <Flex align="center" gap={1} role="group">
    <Text variant="body2" fontWeight={fontWeight}>
      {formatTokenWithValue(token)}
    </Text>
    <TooltipInfo
      label={`Token ID: ${token.denom}`}
      maxW="240px"
      textAlign="center"
    />
    <Copier
      display="none"
      ml={1}
      type={isSupportedToken(token) ? "supported_asset" : "unsupported_asset"}
      value={token.denom}
      amptrackSection={ampCopierSection}
      copyLabel="Token ID Copied!"
    />
  </Flex>
);
