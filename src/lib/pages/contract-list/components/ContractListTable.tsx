import {
  Flex,
  Button,
  Icon,
  Menu,
  MenuList,
  MenuButton,
  MenuDivider,
  chakra,
  MenuItem,
  Grid,
} from "@chakra-ui/react";
import {
  MdMoreHoriz,
  MdMode,
  MdOutlineBookmark,
  MdDelete,
} from "react-icons/md";

import { useInternalNavigate } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import {
  AddToOtherList,
  EditContractDetails,
  RemoveContract,
} from "lib/components/modal/contract";
import { TableContainer, TableHeader, TableRow } from "lib/components/table";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { LVPair } from "lib/types";

import { ContractNameCell } from "./table/ContractNameCell";
import { TagsCell } from "./table/TagsCell";

const StyledIcon = chakra(Icon, {
  baseStyle: {
    boxSize: "4",
    display: "flex",
    alignItems: "center",
  },
});

const TEMPLATE_COLUMNS = "160px 280px 220px 1fr";
interface ContractListTableProps {
  contracts: ContractLocalInfo[];
  contractRemovalInfo?: LVPair;
}

export const ContractListTable = ({
  contracts = [],
  contractRemovalInfo,
}: ContractListTableProps) => {
  const navigate = useInternalNavigate();
  return (
    <TableContainer>
      <Grid templateColumns={TEMPLATE_COLUMNS} px="48px">
        <TableHeader>Contract Address</TableHeader>
        <TableHeader>Contract Name</TableHeader>
        <TableHeader>Tags</TableHeader>
        <TableHeader>Instantiator</TableHeader>
      </Grid>
      {contracts.map((item) => (
        <Grid
          transition="all .25s ease-in-out"
          _hover={{ bg: "gray.900" }}
          cursor="pointer"
          onClick={() =>
            navigate({ pathname: `/contract/${item.contractAddress}` })
          }
          key={
            item.name +
            item.contractAddress +
            item.description +
            item.tags +
            item.lists
          }
          px="48px"
          templateColumns={TEMPLATE_COLUMNS}
        >
          <TableRow>
            <ExplorerLink
              value={item.contractAddress}
              type="contract_address"
              canCopyWithHover
            />
          </TableRow>
          <TableRow>
            <ContractNameCell contractLocalInfo={item} />
          </TableRow>
          <TableRow>
            <TagsCell contractLocalInfo={item} />
          </TableRow>
          <TableRow>
            <Flex justify="space-between" w="full">
              <ExplorerLink
                value={item.instantiator}
                type="user_address"
                canCopyWithHover
              />
              <Flex
                gap={3}
                justifyContent="flex-end"
                onClick={(e) => e.stopPropagation()}
              >
                <AppLink href={`/execute?contract=${item.contractAddress}`}>
                  <Button variant="outline-gray" size="sm">
                    Execute
                  </Button>
                </AppLink>
                <AppLink href={`/query?contract=${item.contractAddress}`}>
                  <Button variant="outline-gray" size="sm">
                    Query
                  </Button>
                </AppLink>
                <Menu>
                  <MenuButton
                    size="sm"
                    variant="ghost-gray"
                    focusBorderColor="primary.main"
                    as={Button}
                  >
                    <StyledIcon as={MdMoreHoriz} color="gray.600" boxSize="6" />
                  </MenuButton>
                  <MenuList>
                    <EditContractDetails
                      contractLocalInfo={item}
                      triggerElement={
                        <MenuItem
                          icon={<StyledIcon as={MdMode} color="gray.600" />}
                        >
                          Edit details
                        </MenuItem>
                      }
                    />
                    <AddToOtherList
                      contractLocalInfo={item}
                      triggerElement={
                        <MenuItem
                          icon={
                            <StyledIcon
                              as={MdOutlineBookmark}
                              color="gray.600"
                            />
                          }
                        >
                          Add or remove from other lists
                        </MenuItem>
                      }
                    />
                    {!!contractRemovalInfo && (
                      <>
                        <MenuDivider />
                        <RemoveContract
                          contractLocalInfo={item}
                          contractRemovalInfo={contractRemovalInfo}
                          menuItemProps={{
                            icon: (
                              <StyledIcon as={MdDelete} color="error.light" />
                            ),
                            children: "Remove from this list",
                          }}
                        />
                      </>
                    )}
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>
          </TableRow>
        </Grid>
      ))}
    </TableContainer>
  );
};
