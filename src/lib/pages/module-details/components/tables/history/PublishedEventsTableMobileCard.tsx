import type { ModuleHistory } from "lib/services/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import {
  MobileCardTemplate,
  MobileLabel,
  RemarkRender,
} from "lib/components/table";
import { dateFromNow, formatUTC } from "lib/utils";

import { PolicyChanges } from "./PublishedEventsTableRow";

interface PublishedEventsTableMobileCardProps {
  history: ModuleHistory;
}

export const PublishedEventsTableMobileCard = ({
  history,
}: PublishedEventsTableMobileCardProps) => (
  <MobileCardTemplate
    middleContent={
      <Flex direction="column" gap={3}>
        <Flex direction="column" flex={1}>
          <MobileLabel label="Block Height" />
          {history.height === 0 ? (
            <Text color="text.dark" variant="body2">
              Genesis
            </Text>
          ) : (
            <ExplorerLink
              showCopyOnHover
              type="block_height"
              value={history.height.toString()}
            />
          )}
        </Flex>
        <Flex direction="column">
          <Text variant="body3">{formatUTC(history.timestamp)}</Text>
          <Text color="text.dark" variant="body3">
            {`(${dateFromNow(history.timestamp)})`}
          </Text>
        </Flex>
      </Flex>
    }
    topContent={
      <Flex direction="column" gap={3}>
        <Flex direction="column">
          <MobileLabel label="Upgrade policy changes" />
          <PolicyChanges history={history} />
        </Flex>
        <Flex direction="column">
          <MobileLabel label="Remark" />
          <RemarkRender {...history.remark} />
        </Flex>
      </Flex>
    }
    middleContent={
      <Flex direction="column" gap={3}>
        <Flex direction="column" flex={1}>
          <MobileLabel label="Block height" />
          {history.height === 0 ? (
            <Text variant="body2" color="text.dark">
              Genesis
            </Text>
          ) : (
            <ExplorerLink
              value={history.height.toString()}
              type="block_height"
              showCopyOnHover
            />
          )}
        </Flex>
        <Flex direction="column">
          <Text variant="body3">{formatUTC(history.timestamp)}</Text>
          <Text variant="body3" color="text.dark">
            {`(${dateFromNow(history.timestamp)})`}
          </Text>
        </Flex>
      </Flex>
    }
  />
);
