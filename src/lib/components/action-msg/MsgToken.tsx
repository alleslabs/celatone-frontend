import { Flex, Text, Tooltip } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";

import { Copier } from "../copy";
import { CustomIcon } from "../icon";
import { formatBalanceWithDenom } from "lib/utils";

interface MsgTokenProps {
  coin: Coin;
  symbol?: string;
  precision?: number;
}

export const MsgToken = ({ coin, symbol, precision }: MsgTokenProps) => (
  <Flex role="group" align="center" gap={1}>
    <Text fontWeight="medium">
      {formatBalanceWithDenom({
        coin,
        symbol,
        precision,
      })}
    </Text>
    <Tooltip
      hasArrow
      label={`Token ID: ${coin.denom}`}
      placement="top"
      bg="honeydew.darker"
      maxW="240px"
    >
      <Flex cursor="pointer">
        <CustomIcon name="info-circle" boxSize="3" />
      </Flex>
    </Tooltip>
    <Copier
      type={symbol ? "supported_asset" : "unsupported_asset"}
      value={coin.denom}
      copyLabel="Token ID Copied!"
      display="none"
      ml="4px"
    />
  </Flex>
);
