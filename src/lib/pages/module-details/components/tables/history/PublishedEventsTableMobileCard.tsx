import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import {
  MobileCardTemplate,
  MobileLabel,
  RemarkRender,
} from "lib/components/table";
import type { ModuleHistory } from "lib/services/types";
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
      <Flex gap={3} direction="column">
        <Flex flex={1} direction="column">
          <MobileLabel label="Block Height" />
          {history.height === 0 ? (
            <Text variant="body2" color="text.dark">
              Genesis
            </Text>
          ) : (
            <ExplorerLink
              type="block_height"
              value={history.height.toString()}
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
    topContent={
      <Flex gap={3} direction="column">
        <Flex direction="column">
          <MobileLabel label="Upgrade Policy Changes" />
          <PolicyChanges history={history} />
        </Flex>
        <Flex direction="column">
          <MobileLabel label="Remark" />
          <RemarkRender {...history.remark} />
        </Flex>
      </Flex>
    }
  />
);
