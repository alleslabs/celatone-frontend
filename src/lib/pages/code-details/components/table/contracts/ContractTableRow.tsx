import { Flex, Text, Grid, IconButton, Box, chakra } from "@chakra-ui/react";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { AddToOtherList, SaveContractDetails } from "lib/components/modal";
import { TableRow } from "lib/components/table/tableComponents";
import { useGetAddressType } from "lib/hooks";
import { ContractNameCell } from "lib/pages/contract-list/components/table/ContractNameCell";
import { TagsCell } from "lib/pages/contract-list/components/table/TagsCell";
import type { ContractInfo } from "lib/types";
import { RemarkOperation } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "22px",
    borderRadius: "36px",
  },
});

interface ContractTableRowProps {
  contractInfo: ContractInfo;
  templateColumnsStyle: string;
}

const InstantiatorRender = ({
  contractInfo: { remark, latestUpdater },
}: Pick<ContractTableRowProps, "contractInfo">) => {
  const getAddressType = useGetAddressType();

  if (!latestUpdater)
    return (
      <Text variant="body2" color="text.dark">
        N/A
      </Text>
    );

  const { operation } = remark;
  const updaterType = getAddressType(latestUpdater);

  switch (operation) {
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

export const ContractTableRow = ({
  contractInfo,
  templateColumnsStyle,
}: ContractTableRowProps) => {
  const navigate = useInternalNavigate();

  return (
    <Grid
      templateColumns={templateColumnsStyle}
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
            <AddToOtherList
              contractLocalInfo={contractInfo}
              triggerElement={
                <StyledIconButton
                  icon={<MdBookmark />}
                  variant="ghost-gray"
                  color="violet.light"
                />
              }
            />
          ) : (
            <SaveContractDetails
              contractLocalInfo={contractInfo}
              triggerElement={
                <StyledIconButton
                  icon={<MdBookmarkBorder />}
                  variant="ghost-gray"
                  color="pebble.600"
                />
              }
            />
          )}
        </Box>
      </TableRow>
    </Grid>
  );
};
