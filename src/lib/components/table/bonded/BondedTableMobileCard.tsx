import { Flex, Text } from "@chakra-ui/react";

import { ValidatorBadge } from "../../ValidatorBadge";
import { MobileLabel } from "../MobileLabel";
import { dateFromNow, formatUTC } from "lib/utils";

import type { BondedInfo } from "./BondedTableRow";
import { TokensCell } from "./TokensCell";

interface BondedTableMobileCardProps {
  bondedInfo: BondedInfo;
  isSingleBondDenom: boolean;
}

export const BondedTableMobileCard = ({
  bondedInfo,
  isSingleBondDenom,
}: BondedTableMobileCardProps) => (
  <Flex
    gap={3}
    minW={0}
    p={3}
    w="full"
    background="gray.900"
    border="1px solid"
    borderColor="gray.700"
    borderRadius="8px"
    direction="column"
  >
    <ValidatorBadge validator={bondedInfo.validator} />
    <Flex
      gap={3}
      pt={3}
      borderTop="1px solid"
      borderTopColor="gray.700"
      direction="column"
    >
      <Flex gap={1} direction="column">
        <MobileLabel label="Amount" />
        <TokensCell
          isSingleBondDenom={isSingleBondDenom}
          tokens={bondedInfo.balances}
        />
      </Flex>

      {bondedInfo.rewards && (
        <Flex gap={1} direction="column">
          <MobileLabel label="Reward" />
          <TokensCell
            isSingleBondDenom={isSingleBondDenom}
            tokens={bondedInfo.rewards}
          />
        </Flex>
      )}
      {bondedInfo.completionTime && (
        <Flex direction="column">
          <MobileLabel label="Unbond Completed By" />
          <Text mt={1} variant="body2" color="text.dark">
            {formatUTC(bondedInfo.completionTime)}
          </Text>
          <Text variant="body3" color="text.disabled">
            {`(${dateFromNow(bondedInfo.completionTime)})`}
          </Text>
        </Flex>
      )}
    </Flex>
  </Flex>
);
