import { Flex, Text } from "@chakra-ui/react";
import { dateFromNow, formatUTC } from "lib/utils";

import type { BondedInfo } from "./BondedTableRow";

import { ValidatorBadge } from "../../ValidatorBadge";
import { MobileLabel } from "../MobileLabel";
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
    background="gray.900"
    border="1px solid"
    borderColor="gray.700"
    borderRadius="8px"
    direction="column"
    gap={3}
    minW={0}
    p={3}
    w="full"
  >
    <ValidatorBadge validator={bondedInfo.validator} />
    <Flex
      borderStyle="solid"
      borderTopColor="gray.700"
      borderTopWidth="1px"
      direction="column"
      gap={3}
      pt={3}
    >
      <Flex direction="column" gap={1}>
        <MobileLabel label="Amount" />
        <TokensCell
          isSingleBondDenom={isSingleBondDenom}
          tokens={bondedInfo.balances}
        />
      </Flex>

      {bondedInfo.rewards && (
        <Flex direction="column" gap={1}>
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
          <Text color="text.dark" mt={1} variant="body2">
            {formatUTC(bondedInfo.completionTime)}
          </Text>
          <Text color="text.disabled" variant="body3">
            {`(${dateFromNow(bondedInfo.completionTime)})`}
          </Text>
        </Flex>
      )}
    </Flex>
  </Flex>
);
