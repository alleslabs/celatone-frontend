import type { GridProps } from "@chakra-ui/react";
import { Flex, Grid, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { RemarkRender, TableRow } from "lib/components/table";
import type { ModuleHistory } from "lib/services/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface PublishedEventsTableRowProps {
  history: ModuleHistory;
  templateColumns: GridProps["templateColumns"];
}

export const PolicyChanges = ({ history }: { history: ModuleHistory }) => {
  const { previousPolicy, upgradePolicy } = history;

  if (!previousPolicy)
    return (
      <Text variant="body2" color="text.dark">
        Set as{" "}
        <Text as="span" color="text.main" fontWeight={700}>
          {capitalize(history.upgradePolicy)}
        </Text>
      </Text>
    );

  if (previousPolicy === upgradePolicy)
    return (
      <Text variant="body2" color="text.dark">
        Remain as{" "}
        <Text as="span" fontWeight={700}>
          {capitalize(history.upgradePolicy)}
        </Text>
      </Text>
    );

  return (
    <Flex align="center" wrap="wrap">
      <Text variant="body2" color="text.dark">
        Changed from{" "}
        <Text as="span" fontWeight={700}>
          {capitalize(previousPolicy)}
        </Text>
      </Text>
      <CustomIcon mx={2} name="arrow-right" boxSize={3} color="primary.main" />
      <Text variant="body2" fontWeight={700}>
        {capitalize(history.upgradePolicy)}
      </Text>
    </Flex>
  );
};

export const PublishedEventsTableRow = ({
  history,
  templateColumns,
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
          type="block_height"
          value={history.height.toString()}
          showCopyOnHover
        />
      )}
    </TableRow>
    <TableRow>
      <Flex direction="column">
        <Text variant="body3">{formatUTC(history.timestamp)}</Text>
        <Text mt="2px" variant="body3" color="text.dark">
          ({dateFromNow(history.timestamp)})
        </Text>
      </Flex>
    </TableRow>
  </Grid>
);
