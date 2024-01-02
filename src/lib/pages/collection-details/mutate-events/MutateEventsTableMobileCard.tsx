import { Badge, Stack, Text } from "@chakra-ui/react";
import { Box } from "@interchain-ui/react";

import { CustomIcon } from "lib/components/icon";
import { MobileCardTemplate } from "lib/components/table";
import type { CollectionMutateEvent } from "lib/services/collection";
import { dateFromNow, formatUTC } from "lib/utils";

export const MutateEventsTableMobileCard = ({
  timestamp,
  mutatedFieldName,
  oldValue,
  newValue,
}: CollectionMutateEvent) => {
  return (
    <MobileCardTemplate
      topContent={
        <Box>
          <Text fontSize="12px" color="gray.400">
            Field Name
          </Text>
          <Badge width="fit-content" size="sm" textTransform="capitalize">
            {mutatedFieldName}
          </Badge>
        </Box>
      }
      middleContent={
        <Stack spacing="12px">
          <Box>
            <Text fontSize="12px" color="gray.400">
              Old Value
            </Text>
            <Text fontSize="14px">{oldValue}</Text>
          </Box>
          <CustomIcon name="arrow-down" />
          <Box>
            <Text fontSize="12px" color="gray.400">
              New Value
            </Text>
            <Text fontSize="14px">{newValue}</Text>
          </Box>
        </Stack>
      }
      bottomContent={
        <Box fontSize="12px">
          <Text color="gray.400">{formatUTC(timestamp)}</Text>
          <Text color="gray.500">({dateFromNow(timestamp)})</Text>
        </Box>
      }
    />
  );
};
