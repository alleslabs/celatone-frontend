import { Flex, Text } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";

import { Copier } from "../copy";
import { TooltipInfo } from "../Tooltip";
import { formatBalanceWithDenom } from "lib/utils";

interface MsgTokenProps {
  coin: Coin;
  symbol?: string;
  precision?: number;
  fontWeight?: number;
}

export const MsgToken = ({
  coin,
  symbol,
  precision,
  fontWeight = 600,
}: MsgTokenProps) => (
  <Flex role="group" align="center" gap={1}>
    <Text fontWeight={fontWeight}>
      {formatBalanceWithDenom({
        coin,
        symbol,
        precision,
      })}
    </Text>
    <TooltipInfo
      label={`Token ID: ${coin.denom}`}
      maxW="240px"
      textAlign="center"
    />
    <Copier
      type={symbol ? "supported_asset" : "unsupported_asset"}
      value={coin.denom}
      copyLabel="Token ID Copied!"
      display="none"
      ml="4px"
    />
  </Flex>
);
