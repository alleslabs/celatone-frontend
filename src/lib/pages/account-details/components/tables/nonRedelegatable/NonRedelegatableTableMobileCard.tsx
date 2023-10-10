import { Flex, Text } from "@chakra-ui/react";

import { MobileLabel } from "lib/components/table";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { NonRedelegatable } from "lib/pages/account-details/type";
import { dateFromNow, formatUTC } from "lib/utils";

interface NonRedelegatablesTableMobileCardProps {
  nonRedelegatable: NonRedelegatable;
}

export const NonRedelegatablesTableMobileCard = ({
  nonRedelegatable,
}: NonRedelegatablesTableMobileCardProps) => (
  <Flex
    direction="column"
    gap={2}
    w="full"
    borderTop="1px solid"
    borderTopColor="gray.700"
    pt={3}
    my={3}
  >
    <MobileLabel label="Cannot Redelegate From" />
    <ValidatorBadge
      badgeSize={{ sm: 8, md: 6 }}
      validator={nonRedelegatable.dstValidator}
    />
    <MobileLabel label="Cannot Redelegate Until" />
    <Flex direction="column">
      <Text variant="body2">{formatUTC(nonRedelegatable.completionTime)}</Text>
      <Text variant="body3" color="text.disabled">
        {`(${dateFromNow(nonRedelegatable.completionTime)})`}
      </Text>
    </Flex>
  </Flex>
);
