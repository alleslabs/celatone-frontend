import {
  Box,
  Button,
  chakra,
  Grid,
  IconButton,
  Text,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { useInternalNavigate, getAddressTypeByLength } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import {
  AddToOtherListModal,
  SaveContractDetailsModal,
} from "lib/components/modal";
import { TableRowNoBorder } from "lib/components/table";

import type { PublicContractInfo } from "./PublicProjectContractTable";

interface ContractTableRowProps {
  publicContractInfo: PublicContractInfo;
  templateColumn: string;
}

// TODO - Revisit this style (exist in multiple places)
const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "22px",
    borderRadius: "36px",
  },
});

export const PublicProjectContractRow = ({
  publicContractInfo,
  templateColumn,
}: ContractTableRowProps) => {
  const navigate = useInternalNavigate();
  const { currentChainName } = useWallet();

  const goToContractDetails = () => {
    navigate({
      pathname: `/contract/${publicContractInfo.publicInfo.contractAddress}`,
    });
  };

  return (
    <Grid
      _hover={{ bg: "pebble.900" }}
      transition="all .25s ease-in-out"
      cursor="pointer"
      onClick={goToContractDetails}
      minW="min-content"
      templateColumns={templateColumn}
      borderBottom="1px solid"
      borderColor="pebble.700"
    >
      <TableRowNoBorder>
        <ExplorerLink
          value={publicContractInfo.publicInfo.contractAddress}
          type={getAddressTypeByLength(
            currentChainName,
            publicContractInfo.publicInfo.contractAddress
          )}
          canCopyWithHover
        />
      </TableRowNoBorder>
      <TableRowNoBorder gap={1}>
        <Text>{publicContractInfo.publicInfo.name}</Text>
        {publicContractInfo.publicInfo.description && (
          <Tooltip
            hasArrow
            label={publicContractInfo.publicInfo.description}
            placement="top"
            bg="honeydew.darker"
            arrowSize={8}
          >
            <Flex cursor="pointer">
              <CustomIcon name="info-circle" boxSize="12px" />
            </Flex>
          </Tooltip>
        )}
      </TableRowNoBorder>
      <TableRowNoBorder>
        <ExplorerLink
          value={publicContractInfo.publicInfo.instantiator}
          type={getAddressTypeByLength(
            currentChainName,
            publicContractInfo.publicInfo.instantiator
          )}
          canCopyWithHover
        />
      </TableRowNoBorder>
      <TableRowNoBorder justifyContent="end">
        <Flex
          gap={3}
          alignItems="center"
          justifyContent="center"
          onClick={(e) => e.stopPropagation()}
        >
          <AppLink
            href={`/execute?contract=${publicContractInfo.publicInfo.contractAddress}`}
          >
            <Button variant="outline-gray" size="sm">
              Execute
            </Button>
          </AppLink>
          <AppLink
            href={`/query?contract=${publicContractInfo.publicInfo.contractAddress}`}
          >
            <Button variant="outline-gray" size="sm">
              Query
            </Button>
          </AppLink>
          <Box onClick={(e) => e.stopPropagation()}>
            {publicContractInfo.localInfo.lists ? (
              <AddToOtherListModal
                contractLocalInfo={publicContractInfo.localInfo}
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
                contractLocalInfo={publicContractInfo.localInfo}
                triggerElement={
                  <StyledIconButton
                    icon={<CustomIcon name="bookmark" />}
                    variant="ghost-gray"
                  />
                }
              />
            )}
          </Box>
        </Flex>
      </TableRowNoBorder>
    </Grid>
  );
};
