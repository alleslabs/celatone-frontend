import { Flex, Text } from "@chakra-ui/react";

import { MobileLabel } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
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
    borderRadius="8px"
    background="gray.900"
    p={3}
    direction="column"
    gap={3}
    w="full"
  >
    <ValidatorBadge validator={bondedInfo.validator} />
    <Flex
      direction="column"
      gap={3}
      borderTop="1px solid"
      borderTopColor="gray.700"
      pt={3}
    >
      <Flex direction="column" gap={1}>
        <MobileLabel label="Amount" />
        <TokensCell
          tokens={bondedInfo.balances}
          isSingleBondDenom={isSingleBondDenom}
        />
      </Flex>

      {bondedInfo.rewards && (
        <Flex direction="column" gap={1}>
          <MobileLabel label="Reward" />
          <TokensCell
            tokens={bondedInfo.rewards}
            isSingleBondDenom={isSingleBondDenom}
          />
        </Flex>
      )}
      {bondedInfo.completionTime && (
        <Flex direction="column">
          <MobileLabel label="Unbond Completed By" />
          <Text variant="body2" color="text.dark" mt={1}>
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
