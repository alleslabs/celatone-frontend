import type { TokenWithValue } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { formatTokenWithValue, isSupportedToken } from "lib/utils";

import { Copier } from "../copy";
import { TooltipInfo } from "../Tooltip";

interface MsgTokenProps {
  token: TokenWithValue;
  fontWeight?: number;
  ampCopierSection?: string;
}

export const MsgToken = ({
  token,
  fontWeight = 600,
  ampCopierSection,
}: MsgTokenProps) => (
  <Flex align="center" gap={1} role="group">
    <Text fontWeight={fontWeight} variant="body2">
      {formatTokenWithValue(token)}
    </Text>
    <TooltipInfo
      label={`Token ID: ${token.denom}`}
      maxW="240px"
      textAlign="center"
    />
    <Copier
      amptrackSection={ampCopierSection}
      copyLabel="Token ID copied!"
      display="none"
      ml={1}
      type={isSupportedToken(token) ? "supported_asset" : "unsupported_asset"}
      value={token.denom}
    />
  </Flex>
);
