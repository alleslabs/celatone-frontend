import type { MutateEvent } from "lib/types";

import { Badge, Flex, Stack, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
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
        <CustomIcon color="gray.600" name="arrow-down" />
        <Flex direction="column">
          <MobileLabel label="New value" />
          <Text variant="body2" wordBreak="break-word">
            {newValue}
          </Text>
        </Flex>
      </Stack>
    }
    topContent={
      <Flex direction="column">
        <MobileLabel label="Field Name" />
        <Badge mt={1} size="sm" textTransform="capitalize" width="fit-content">
          {mutatedFieldName}
        </Badge>
      </Flex>
    }
  />
);
