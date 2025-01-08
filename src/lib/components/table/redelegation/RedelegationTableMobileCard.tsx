import { Flex, Grid, Text } from "@chakra-ui/react";

import { CustomIcon } from "../../icon";
import { ValidatorBadge } from "../../ValidatorBadge";
import { MobileLabel } from "../MobileLabel";
import { TokenCell } from "../TokenCell";
import type { Redelegation } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface RedelegationTableMobileCardProps {
  redelegation: Redelegation;
}

export const RedelegationTableMobileCard = ({
  redelegation,
}: RedelegationTableMobileCardProps) => (
  <Flex
    background="gray.900"
    borderRadius="8px"
    p={3}
    direction="column"
    gap={3}
    w="full"
  >
    <Grid
      borderBottom="1px solid"
      pb={3}
      borderBottomColor="gray.700"
      templateColumns="1fr 32px 1fr"
      alignItems="center"
    >
      <Flex direction="column" gap={1} minW={0}>
        <MobileLabel label="From validator" />
        <ValidatorBadge validator={redelegation.srcValidator} />
      </Flex>
      <CustomIcon name="arrow-right" boxSize={3} color="gray.600" />
      <Flex direction="column" gap={1} minW={0}>
        <MobileLabel label="To validator" />
        <ValidatorBadge validator={redelegation.dstValidator} />
      </Flex>
    </Grid>
    <Flex direction="column" gap={1}>
      <MobileLabel label="Amount" />
      {redelegation.balances.map((balance) => (
        <TokenCell key={balance.denom} token={balance} />
      ))}
    </Flex>
    <Flex direction="column" gap={1}>
      <MobileLabel label="Completed by" />
      <Flex direction="column">
        <Text variant="body2">{formatUTC(redelegation.completionTime)}</Text>
        <Text variant="body3" color="text.disabled">
          {`(${dateFromNow(redelegation.completionTime)})`}
        </Text>
      </Flex>
    </Flex>
  </Flex>
);
