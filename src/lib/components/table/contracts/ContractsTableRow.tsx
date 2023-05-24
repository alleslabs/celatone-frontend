import { Flex, Text, Grid } from "@chakra-ui/react";

import { TableRow } from "../tableComponents";
import { useGetAddressType, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ContractAddr, ContractInfo } from "lib/types";
import { RemarkOperation } from "lib/types";

import { ContractNameCell } from "./ContractNameCell";
import type { CTAInfo } from "./ContractsTableRowCTA";
import { ContractsTableRowCTA } from "./ContractsTableRowCTA";
import { TagsCell } from "./TagsCell";

interface ContractsTableRowProps {
  contractInfo: ContractInfo;
  templateColumns: string;
  onRowSelect: (contract: ContractAddr) => void;
  isReadOnly: boolean;
  withCTA?: CTAInfo;
}

export const InstantiatorRender = ({
  contractInfo: { instantiator, remark, latestUpdater },
  isReadOnly,
}: {
  contractInfo: ContractInfo;
  isReadOnly: boolean;
}) => {
  const isMobile = useMobile();
  const getAddressType = useGetAddressType();

  /**
   * @remarks handle the case where the data is too old and cannot be found
   */
  if (!latestUpdater)
    return instantiator ? (
      <ExplorerLink
        value={instantiator}
        type="user_address"
        showCopyOnHover
        isReadOnly={isReadOnly}
      />
    ) : (
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
          {!isMobile && (
            <Text variant="body3" color="text.dark">
              Migrated by
            </Text>
          )}
          <ExplorerLink
            value={latestUpdater}
            type={updaterType}
            showCopyOnHover
            isReadOnly={isReadOnly}
          />
        </Flex>
      );
    case RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT:
      return (
        <ExplorerLink
          value={latestUpdater}
          type={updaterType}
          showCopyOnHover
          isReadOnly={isReadOnly}
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
  onRowSelect,
  isReadOnly,
  withCTA,
}: ContractsTableRowProps) => (
  <Grid
    templateColumns={templateColumns}
    onClick={() => onRowSelect(contractInfo.contractAddress)}
    _hover={{ bg: "gray.900" }}
    transition="all .25s ease-in-out"
    cursor="pointer"
    minW="min-content"
  >
    <TableRow>
      <ExplorerLink
        value={contractInfo.contractAddress}
        type="contract_address"
        showCopyOnHover
        isReadOnly={isReadOnly}
      />
    </TableRow>

    <TableRow>
      <ContractNameCell
        contractLocalInfo={contractInfo}
        isReadOnly={isReadOnly}
      />
    </TableRow>

    <TableRow>
      <TagsCell contractLocalInfo={contractInfo} isReadOnly={isReadOnly} />
    </TableRow>

    <TableRow>
      <InstantiatorRender contractInfo={contractInfo} isReadOnly={isReadOnly} />
    </TableRow>

    {!isReadOnly && (
      <ContractsTableRowCTA contractInfo={contractInfo} withCTA={withCTA} />
    )}
  </Grid>
);
