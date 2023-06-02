import {
  Box,
  Button,
  chakra,
  Grid,
  IconButton,
  Text,
  Flex,
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
import { TableRow } from "lib/components/table";
import { Tooltip } from "lib/components/Tooltip";

import type { PublicContractInfo } from "./PublicProjectContractTable";

interface ContractTableRowProps {
  publicContractInfo: PublicContractInfo;
  templateColumns: string;
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
  templateColumns,
}: ContractTableRowProps) => {
  const navigate = useInternalNavigate();
  const { currentChainName } = useWallet();

  const goToContractDetails = () => {
    navigate({
      pathname: `/contracts/${publicContractInfo.publicInfo.contractAddress}`,
    });
  };

  return (
    <Grid
      templateColumns={templateColumns}
      onClick={goToContractDetails}
      _hover={{ bg: "gray.900" }}
      transition="all .25s ease-in-out"
      cursor="pointer"
      minW="min-content"
    >
      <TableRow>
        <ExplorerLink
          value={publicContractInfo.publicInfo.contractAddress}
          type={getAddressTypeByLength(
            currentChainName,
            publicContractInfo.publicInfo.contractAddress
          )}
          showCopyOnHover
        />
      </TableRow>
      <TableRow gap={1}>
        <Text>{publicContractInfo.publicInfo.name}</Text>
        {publicContractInfo.publicInfo.description && (
          <Tooltip label={publicContractInfo.publicInfo.description}>
            <Flex cursor="pointer">
              <CustomIcon name="info-circle" boxSize="12px" color="gray.600" />
            </Flex>
          </Tooltip>
        )}
      </TableRow>
      <TableRow>
        <ExplorerLink
          value={publicContractInfo.publicInfo.instantiator}
          type={getAddressTypeByLength(
            currentChainName,
            publicContractInfo.publicInfo.instantiator
          )}
          showCopyOnHover
        />
      </TableRow>
      <TableRow justifyContent="end">
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
                    icon={<CustomIcon name="bookmark-solid" />}
                    variant="ghost-primary"
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
      </TableRow>
    </Grid>
  );
};
