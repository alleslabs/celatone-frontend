import { Flex, Text, Grid, IconButton, Box, chakra } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { AddToOtherList, SaveContractDetails } from "lib/components/modal";
import { TableRow } from "lib/components/table/tableComponents";
import { ContractNameCell } from "lib/pages/contract-list/components/table/ContractNameCell";
import { TagsCell } from "lib/pages/contract-list/components/table/TagsCell";
import type { ContractInfo } from "lib/types";
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

export const ContractTableRow = ({
  contractInfo,
  templateColumnsStyle,
}: ContractTableRowProps) => {
  const router = useRouter();

  return (
    <Grid
      templateColumns={templateColumnsStyle}
      onClick={() =>
        router.push({
          pathname: `/contract/${contractInfo.contractAddress}`,
        })
      }
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
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
        {!contractInfo.latestUpdator.length ? (
          <Text variant="body2" textColor="text.dark" cursor="text">
            NaN
          </Text>
        ) : (
          <Flex direction="column" onClick={(e) => e.stopPropagation()}>
            {contractInfo.latestUpdated > contractInfo.instantiated && (
              <Text variant="body3" textColor="text.dark" cursor="text">
                Migrated by
              </Text>
            )}
            <ExplorerLink
              value={contractInfo.latestUpdator}
              type="user_address"
              canCopyWithHover
            />
          </Flex>
        )}
      </TableRow>

      <TableRow>
        <Flex
          direction="column"
          gap={1}
          onClick={(e) => e.stopPropagation()}
          cursor="text"
        >
          <Text variant="body2">
            {formatUTC(contractInfo.latestUpdated.toString())}
          </Text>
          <Text variant="body2" color="text.dark">
            {`(${dateFromNow(contractInfo.latestUpdated.toString())})`}
          </Text>
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
                  color="primary.main"
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
                  color="gray.600"
                />
              }
            />
          )}
        </Box>
      </TableRow>
    </Grid>
  );
};
