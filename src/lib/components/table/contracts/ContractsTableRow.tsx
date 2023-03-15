import { Flex, Text, Grid, IconButton, Box, chakra } from "@chakra-ui/react";

import { TableRow } from "../tableComponents";
import { useInternalNavigate, useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import {
  AddToOtherListModal,
  SaveContractDetailsModal,
} from "lib/components/modal";
import type { ContractInfo } from "lib/types";
import { RemarkOperation } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { ContractNameCell } from "./ContractNameCell";
import { TagsCell } from "./TagsCell";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "22px",
    borderRadius: "36px",
  },
});

interface ContractsTableRowProps {
  contractInfo: ContractInfo;
  templateColumns: string;
}

const InstantiatorRender = ({
  contractInfo: { remark, latestUpdater },
}: Pick<ContractsTableRowProps, "contractInfo">) => {
  const getAddressType = useGetAddressType();

  /**
   * @remarks handle the case where the data is too old and cannot be found
   */
  if (!latestUpdater)
    return (
      <Text variant="body2" color="text.dark">
        N/A
      </Text>
    );

  const updaterType = getAddressType(latestUpdater);

  switch (remark?.operation) {
    case RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS:
      return (
        <Text variant="body2" color="text.dark" cursor="text">
          Genesis
        </Text>
      );
    case RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE:
      return (
        <Flex direction="column" onClick={(e) => e.stopPropagation()}>
          <Text variant="body3" color="text.dark">
            Migrated by
          </Text>
          <ExplorerLink
            value={latestUpdater}
            type={updaterType}
            canCopyWithHover
          />
        </Flex>
      );
    case RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT:
      return (
        <ExplorerLink
          value={latestUpdater}
          type={updaterType}
          canCopyWithHover
        />
      );
    default:
      return (
        <Text variant="body2" color="text.dark">
          N/A
        </Text>
      );
  }
};

export const ContractsTableRow = ({
  contractInfo,
  templateColumns,
}: ContractsTableRowProps) => {
  const navigate = useInternalNavigate();

  return (
    <Grid
      templateColumns={templateColumns}
      onClick={() =>
        navigate({
          pathname: `/contract/${contractInfo.contractAddress}`,
        })
      }
      _hover={{ bg: "pebble.900" }}
      transition="all .25s ease-in-out"
      cursor="pointer"
      minW="min-content"
    >
      <TableRow>
        <ExplorerLink
          value={contractInfo.contractAddress}
          type="contract_address"
          canCopyWithHover
        />
      </TableRow>

      <TableRow>
        <ContractNameCell contractLocalInfo={contractInfo} />
      </TableRow>

      <TableRow>
        <TagsCell contractLocalInfo={contractInfo} />
      </TableRow>

      <TableRow>
        <InstantiatorRender contractInfo={contractInfo} />
      </TableRow>

      <TableRow>
        <Flex
          direction="column"
          gap={1}
          onClick={(e) => e.stopPropagation()}
          cursor="text"
        >
          {contractInfo.latestUpdated ? (
            <>
              <Text variant="body2">
                {formatUTC(contractInfo.latestUpdated)}
              </Text>
              <Text variant="body2" color="text.dark">
                {`(${dateFromNow(contractInfo.latestUpdated)})`}
              </Text>
            </>
          ) : (
            <Text variant="body2" color="text.dark">
              N/A
            </Text>
          )}
        </Flex>
      </TableRow>

      <TableRow>
        <Box onClick={(e) => e.stopPropagation()}>
          {contractInfo.lists ? (
            <AddToOtherListModal
              contractLocalInfo={contractInfo}
              triggerElement={
                <StyledIconButton
                  icon={
                    <CustomIcon name="bookmark-solid" color="violet.light" />
                  }
                  variant="ghost-gray"
                />
              }
            />
          ) : (
            <SaveContractDetailsModal
              contractLocalInfo={contractInfo}
              triggerElement={
                <StyledIconButton
                  icon={<CustomIcon name="bookmark" />}
                  variant="ghost-gray"
                />
              }
            />
          )}
        </Box>
      </TableRow>
    </Grid>
  );
};
