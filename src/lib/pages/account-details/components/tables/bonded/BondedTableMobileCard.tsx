import { Flex, Text } from "@chakra-ui/react";

import { TokenCell } from "../TokenCell";
import { MobileLabel } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import { dateFromNow, formatUTC } from "lib/utils";

import type { BondedInfo } from "./BondedTableRow";

interface BondedTableMobileCardProps {
  bondedInfo: BondedInfo;
}

export const BondedTableMobileCard = ({
  bondedInfo,
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
        <TokenCell token={bondedInfo.amount} />
      </Flex>

      {bondedInfo.reward && (
        <Flex direction="column" gap={1}>
          <MobileLabel label="Reward" />
          <TokenCell token={bondedInfo.reward} />
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
