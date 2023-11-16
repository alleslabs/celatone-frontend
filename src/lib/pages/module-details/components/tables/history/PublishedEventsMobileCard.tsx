import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import type { ModuleHistory } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { PolicyChanges, RemarkRender } from "./ModuleHistoryRow";

interface PublishedEventsMobileCardProps {
  history: ModuleHistory;
}

export const PublishedEventsMobileCard = ({
  history,
}: PublishedEventsMobileCardProps) => {
  return (
    <MobileCardTemplate
      topContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel label="Upgrade Policy Changes" />
            <PolicyChanges history={history} />
          </Flex>
          <Flex direction="column">
            <MobileLabel label="Remark" />
            {history.remark && <RemarkRender remark={history.remark} />}
          </Flex>
        </Flex>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column" flex="1">
            <MobileLabel label="Block Height" />
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
};
