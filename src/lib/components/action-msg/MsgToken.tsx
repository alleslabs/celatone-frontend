import { Flex, Text } from "@chakra-ui/react";

import type { TokenWithValue } from "lib/types";
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
  <Flex role="group" align="center" gap={1}>
    <Text fontWeight={fontWeight} variant="body2">
      {formatTokenWithValue(token)}
    </Text>
    <TooltipInfo
      label={`Token ID: ${token.denom}`}
      maxW="240px"
      textAlign="center"
    />
    <Copier
      type={isSupportedToken(token) ? "supported_asset" : "unsupported_asset"}
      value={token.denom}
      copyLabel="Token ID Copied!"
      display="none"
      ml={1}
      amptrackSection={ampCopierSection}
    />
  </Flex>
);
