import { Flex, Text } from "@chakra-ui/react";

import { ValidatorBadge } from "../../ValidatorBadge";
import { MobileLabel } from "../MobileLabel";
import type { NonRedelegatable } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface NonRedelegatablesTableMobileCardProps {
  nonRedelegatable: NonRedelegatable;
}

export const NonRedelegatablesTableMobileCard = ({
  nonRedelegatable,
}: NonRedelegatablesTableMobileCardProps) => (
  <Flex
    gap={2}
    minW={0}
    my={3}
    pt={3}
    w="full"
    borderTop="1px solid"
    borderTopColor="gray.700"
    direction="column"
  >
    <MobileLabel label="Cannot Redelegate From" />
    <ValidatorBadge validator={nonRedelegatable.dstValidator} />
    <MobileLabel label="Cannot Redelegate Until" />
    <Flex direction="column">
      <Text variant="body2">{formatUTC(nonRedelegatable.completionTime)}</Text>
      <Text variant="body3" color="text.disabled">
        {`(${dateFromNow(nonRedelegatable.completionTime)})`}
      </Text>
    </Flex>
  </Flex>
);
