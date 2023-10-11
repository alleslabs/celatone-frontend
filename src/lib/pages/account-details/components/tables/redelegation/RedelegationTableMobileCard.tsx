import { Flex, Grid, Text } from "@chakra-ui/react";

import { TokenCell } from "../TokenCell";
import { CustomIcon } from "lib/components/icon";
import { MobileLabel } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { Redelegation } from "lib/pages/account-details/data";
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
      <Flex direction="column" gap={1}>
        <MobileLabel label="From validator" />
        <ValidatorBadge
          maxWidth="100px"
          badgeSize={{ sm: 8, md: 6 }}
          validator={redelegation.srcValidator}
        />
      </Flex>
      <CustomIcon name="arrow-right" boxSize={3} color="gray.600" />
      <Flex direction="column" gap={1}>
        <MobileLabel label="To validator" />
        <ValidatorBadge
          maxWidth="100px"
          badgeSize={{ sm: 8, md: 6 }}
          validator={redelegation.dstValidator}
        />
      </Flex>
    </Grid>
    <Flex direction="column" gap={1}>
      <MobileLabel label="Amount" />
      <TokenCell token={redelegation.token} />
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
