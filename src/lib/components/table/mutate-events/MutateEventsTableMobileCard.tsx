import { Badge, Flex, Stack, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { MutateEvent } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";
import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";

export const MutateEventsTableMobileCard = ({
  timestamp,
  mutatedFieldName,
  oldValue,
  newValue,
}: MutateEvent) => (
  <MobileCardTemplate
    topContent={
      <Flex direction="column">
        <MobileLabel label="Field name" />
        <Badge width="fit-content" mt={1} size="sm" textTransform="capitalize">
          {mutatedFieldName}
        </Badge>
      </Flex>
    }
    middleContent={
      <Stack spacing="12px">
        <Flex direction="column">
          <MobileLabel label="Old value" />
          <Text variant="body2" wordBreak="break-word">
            {oldValue}
          </Text>
        </Flex>
        <CustomIcon name="arrow-down" color="gray.600" />
        <Flex direction="column">
          <MobileLabel label="New value" />
          <Text variant="body2" wordBreak="break-word">
            {newValue}
          </Text>
        </Flex>
      </Stack>
    }
    bottomContent={
      <Flex direction="column" gap={1}>
        <Text variant="body3">{formatUTC(timestamp)}</Text>
        <Text variant="body3" color="text.dark">
          {`(${dateFromNow(timestamp)})`}
        </Text>
      </Flex>
    }
  />
);
