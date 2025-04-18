import type { GridProps } from "@chakra-ui/react";
import type { ModuleHistory } from "lib/services/types";

import { Flex, Grid, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { RemarkRender, TableRow } from "lib/components/table";
import { dateFromNow, formatUTC } from "lib/utils";
import { capitalize } from "lodash";

interface PublishedEventsTableRowProps {
  templateColumns: GridProps["templateColumns"];
  history: ModuleHistory;
}

export const PolicyChanges = ({ history }: { history: ModuleHistory }) => {
  const { previousPolicy, upgradePolicy } = history;

  if (!previousPolicy)
    return (
      <Text color="text.dark" variant="body2">
        Set as{" "}
        <Text as="span" color="text.main" fontWeight={700}>
          {capitalize(history.upgradePolicy)}
        </Text>
      </Text>
    );

  if (previousPolicy === upgradePolicy)
    return (
      <Text color="text.dark" variant="body2">
        Remain as{" "}
        <Text as="span" fontWeight={700}>
          {capitalize(history.upgradePolicy)}
        </Text>
      </Text>
    );

  return (
    <Flex align="center" wrap="wrap">
      <Text color="text.dark" variant="body2">
        Changed from{" "}
        <Text as="span" fontWeight={700}>
          {capitalize(previousPolicy)}
        </Text>
      </Text>
      <CustomIcon boxSize={3} color="primary.main" mx={2} name="arrow-right" />
      <Text fontWeight={700} variant="body2">
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
    </TableRow>
    <TableRow>
      <Flex direction="column">
        <Text variant="body3">{formatUTC(history.timestamp)}</Text>
        <Text color="text.dark" mt="2px" variant="body3">
          ({dateFromNow(history.timestamp)})
        </Text>
      </Flex>
    </TableRow>
  </Grid>
);
