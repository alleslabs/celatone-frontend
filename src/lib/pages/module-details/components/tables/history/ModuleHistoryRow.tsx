import type { GridProps } from "@chakra-ui/react";
import { Flex, Grid, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TableRow } from "lib/components/table";
import type { ModuleHistory } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface ModuleHistoriesRowProps {
  templateColumns: GridProps["templateColumns"];
  history: ModuleHistory;
}

export const RemarkRender = ({
  remark,
}: {
  remark: ModuleHistory["remark"];
}) => {
  const { type, value } = remark;
  if (type === "genesis") return <Text variant="body2">Genesis</Text>;

  const isGovernance = type === "governance";
  const textFormat = isGovernance ? "normal" : "truncate";
  return (
    <Flex
      direction="column"
      sx={{
        "& > p:first-of-type": {
          color: "text.dark",
          fontSize: "12px",
        },
      }}
      mb={{ base: 0, md: "2px" }}
    >
      <p>{isGovernance ? "Through Proposal ID" : "Tx Hash"}</p>
      <ExplorerLink
        type={isGovernance ? "proposal_id" : "tx_hash"}
        value={value.toString()}
        showCopyOnHover
        textFormat={textFormat}
      />
    </Flex>
  );
};

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
              {capitalize(history.previousPolicy)}
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

export const ModuleHistoryRow = ({
  templateColumns,
  history,
}: ModuleHistoriesRowProps) => (
  <Grid templateColumns={templateColumns}>
    <TableRow>
      <RemarkRender remark={history.remark} />
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
        <Text variant="body2" color="text.dark">
          {formatUTC(history.timestamp)}
        </Text>
        <Text variant="body3" color="text.dark" mt="2px">
          ({dateFromNow(history.timestamp)})
        </Text>
      </Flex>
    </TableRow>
  </Grid>
);
