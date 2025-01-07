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
    gap={3}
    p={3}
    w="full"
    background="gray.900"
    borderRadius="8px"
    direction="column"
  >
    <Grid
      alignItems="center"
      pb={3}
      borderBottom="1px solid"
      borderBottomColor="gray.700"
      templateColumns="1fr 32px 1fr"
    >
      <Flex gap={1} minW={0} direction="column">
        <MobileLabel label="From validator" />
        <ValidatorBadge validator={redelegation.srcValidator} />
      </Flex>
      <CustomIcon name="arrow-right" boxSize={3} color="gray.600" />
      <Flex gap={1} minW={0} direction="column">
        <MobileLabel label="To validator" />
        <ValidatorBadge validator={redelegation.dstValidator} />
      </Flex>
    </Grid>
    <Flex gap={1} direction="column">
      <MobileLabel label="Amount" />
      {redelegation.balances.map((balance) => (
        <TokenCell key={balance.denom} token={balance} />
      ))}
    </Flex>
    <Flex gap={1} direction="column">
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
