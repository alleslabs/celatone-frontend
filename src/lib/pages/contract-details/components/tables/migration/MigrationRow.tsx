import type { GridProps } from "@chakra-ui/react";
import { chakra, Flex, Grid, GridItem, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { useGetAddressType } from "lib/hooks";
import type { ContractMigrationHistory } from "lib/types";
import { RemarkOperation } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

const StyledGridItem = chakra(GridItem, {
  baseStyle: {
    color: "text.main",
    fontSize: "14px",
    fontWeight: 400,
    p: 4,
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid",
    borderColor: "divider.main",
  },
});

interface MigrationRowProps {
  templateColumns: GridProps["templateColumns"];
  history: ContractMigrationHistory;
}

const RemarkRender = ({
  remark,
}: {
  remark: ContractMigrationHistory["remark"];
}) => {
  const { operation, type, value } = remark;
  const isGovernance = type === "governance";
  if (
    operation === RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS
  )
    return <Text variant="body2">Genesis</Text>;
  return (
    <Flex
      direction="column"
      sx={{
        "& > p:first-of-type": {
          color: "text.dark",
          fontSize: "12px",
          mb: "2px",
        },
      }}
    >
      <p>{isGovernance ? "Through Proposal ID" : "Tx Hash"}</p>
      <ExplorerLink
        type={isGovernance ? "proposal_id" : "tx_hash"}
        value={value}
        canCopyWithHover
      />
    </Flex>
  );
};

export const MigrationRow = ({
  templateColumns,
  history,
}: MigrationRowProps) => {
  const getAddressType = useGetAddressType();
  return (
    <Grid templateColumns={templateColumns}>
      <StyledGridItem>
        <ExplorerLink
          type="code_id"
          value={history.codeId.toString()}
          canCopyWithHover
        />
      </StyledGridItem>
      <StyledGridItem>
        {history.codeDescription || (
          <Text color="text.dark">No Description</Text>
        )}
      </StyledGridItem>
      <StyledGridItem>
        <ExplorerLink
          type={getAddressType(history.sender)}
          value={history.sender}
          textFormat="truncate"
          canCopyWithHover
        />
      </StyledGridItem>
      <StyledGridItem>
        <ExplorerLink
          type="block_height"
          value={history.height.toString()}
          canCopyWithHover
        />
      </StyledGridItem>
      <StyledGridItem>
        <Flex
          direction="column"
          fontSize="12px"
          sx={{ "& p + p": { color: "text.dark", mt: "2px" } }}
        >
          <p>{formatUTC(history.timestamp)}</p>
          <p>({dateFromNow(history.timestamp)})</p>
        </Flex>
      </StyledGridItem>
      <StyledGridItem>
        <RemarkRender remark={history.remark} />
      </StyledGridItem>
    </Grid>
  );
};
