import type { GridProps } from "@chakra-ui/react";
import { Flex, Grid, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { RemarkRender, TableRow } from "lib/components/table";
import type { ModuleHistory } from "lib/services/move/module";
import { dateFromNow, formatUTC } from "lib/utils";

interface PublishedEventsTableRowProps {
  templateColumns: GridProps["templateColumns"];
  history: ModuleHistory;
}

export const PolicyChanges = ({ history }: { history: ModuleHistory }) => {
  switch (history.previousPolicy) {
    case undefined:
      return (
        <Text variant="body2" color="text.dark">
          Set as{" "}
          <Text as="span" fontWeight={700} color="text.main">
            {capitalize(history.upgradePolicy)}
          </Text>
        </Text>
      );
    case history.upgradePolicy:
      return (
        <Text variant="body2" color="text.dark">
          Remain as{" "}
          <Text as="span" fontWeight={700}>
            {capitalize(history.upgradePolicy)}
          </Text>
        </Text>
      );
    default:
      return (
        <Flex align="center" wrap="wrap">
          <Text variant="body2" color="text.dark">
            Changed from{" "}
            <Text as="span" fontWeight={700}>
              {capitalize(history.previousPolicy ?? undefined)}
            </Text>
          </Text>
          <CustomIcon
            name="arrow-right"
            boxSize={3}
            color="accent.main"
            mx={2}
          />
          <Text variant="body2" fontWeight={700}>
            {capitalize(history.upgradePolicy)}
          </Text>
        </Flex>
      );
  }
};

export const PublishedEventsTableRow = ({
  templateColumns,
  history,
}: PublishedEventsTableRowProps) => (
  <Grid templateColumns={templateColumns}>
    <TableRow />
    <TableRow>
      <RemarkRender {...history.remark} />
    </TableRow>
    <TableRow>
      <PolicyChanges history={history} />
    </TableRow>
    <TableRow>
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
    </TableRow>
    <TableRow>
      <Flex direction="column">
        <Text variant="body3">{formatUTC(history.timestamp)}</Text>
        <Text variant="body3" color="text.dark" mt="2px">
          ({dateFromNow(history.timestamp)})
        </Text>
      </Flex>
    </TableRow>
  </Grid>
);
