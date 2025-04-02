import type { Redelegation } from "lib/types";

import { Flex, Grid, Text } from "@chakra-ui/react";
import { dateFromNow, formatUTC } from "lib/utils";

import { CustomIcon } from "../../icon";
import { ValidatorBadge } from "../../ValidatorBadge";
import { MobileLabel } from "../MobileLabel";
import { TokenCell } from "../TokenCell";

interface RedelegationTableMobileCardProps {
  redelegation: Redelegation;
}

export const RedelegationTableMobileCard = ({
  redelegation,
}: RedelegationTableMobileCardProps) => (
  <Flex
    background="gray.900"
    borderRadius="8px"
    direction="column"
    gap={3}
    p={3}
    w="full"
  >
    <Grid
      alignItems="center"
      borderBottomColor="gray.700"
      borderBottomWidth="1px"
      borderStyle="solid"
      pb={3}
      templateColumns="1fr 32px 1fr"
    >
      <Flex direction="column" gap={1} minW={0}>
        <MobileLabel label="From validator" />
        <ValidatorBadge validator={redelegation.srcValidator} />
      </Flex>
      <CustomIcon boxSize={3} color="gray.600" name="arrow-right" />
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
        <Text color="text.disabled" variant="body3">
          {`(${dateFromNow(redelegation.completionTime)})`}
        </Text>
      </Flex>
    </Flex>
  </Flex>
);
