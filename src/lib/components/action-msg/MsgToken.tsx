import { Flex, Text } from "@chakra-ui/react";
import { isUndefined } from "lodash";

import { Copier } from "../copy";
import { TooltipInfo } from "../Tooltip";
import type { TokenWithValue } from "lib/types";
import { formatTokenWithValue } from "lib/utils";

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
      type={isUndefined(token.price) ? "supported_asset" : "unsupported_asset"}
      value={token.denom}
      copyLabel="Token ID Copied!"
      display="none"
      ml={1}
      amptrackSection={ampCopierSection}
    />
  </Flex>
);
