import type { Nullish, WasmVerifyInfo } from "lib/types";

import {
  Box,
  Button,
  chakra,
  Flex,
  Grid,
  IconButton,
  Text,
} from "@chakra-ui/react";
import {
  useGetAddressTypeByLength,
  useInternalNavigate,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import {
  AddToOtherListModal,
  SaveContractDetailsModal,
} from "lib/components/modal";
import { TableRow } from "lib/components/table";
import { Tooltip } from "lib/components/Tooltip";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { ContractInteractionTabs } from "lib/types";
import { getWasmVerifyStatus } from "lib/utils";

import type { PublicContractInfo } from ".";

interface ContractTableRowProps {
  templateColumns: string;
  publicContractInfo: PublicContractInfo;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

// TODO - Revisit this style (exist in multiple places)
const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    alignItems: "center",
    borderRadius: "36px",
    display: "flex",
    fontSize: "22px",
  },
});

export const PublicProjectContractRow = ({
  publicContractInfo,
  templateColumns,
  wasmVerifyInfo,
}: ContractTableRowProps) => {
  const navigate = useInternalNavigate();
  const getAddressTypeByLength = useGetAddressTypeByLength();

  const goToContractDetails = () => {
    navigate({
      pathname: `/contracts/${publicContractInfo.publicInfo.contractAddress}`,
    });
  };

  return (
    <Grid
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      minW="min-content"
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
      onClick={goToContractDetails}
    >
      <TableRow>
        <ExplorerLink
          rightIcon={
            <WasmVerifyBadge
              linkedCodeId={publicContractInfo.publicInfo.code}
              relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
              status={getWasmVerifyStatus(wasmVerifyInfo)}
            />
          }
          showCopyOnHover
          type={getAddressTypeByLength(
            publicContractInfo.publicInfo.contractAddress
          )}
          value={publicContractInfo.publicInfo.contractAddress}
        />
      </TableRow>
      <TableRow gap={1}>
        <Text>{publicContractInfo.publicInfo.name}</Text>
        {publicContractInfo.publicInfo.description && (
          <Tooltip label={publicContractInfo.publicInfo.description}>
            <Flex cursor="pointer">
              <CustomIcon boxSize="12px" color="gray.600" name="info-circle" />
            </Flex>
          </Tooltip>
        )}
      </TableRow>
      <TableRow>
        <ExplorerLink
          showCopyOnHover
          type={getAddressTypeByLength(
            publicContractInfo.publicInfo.instantiator
          )}
          value={publicContractInfo.publicInfo.instantiator}
        />
      </TableRow>
      <TableRow justifyContent="end">
        <Flex
          alignItems="center"
          gap={3}
          justifyContent="center"
          onClick={(e) => e.stopPropagation()}
        >
          <AppLink
            href={`/interact-contract?selectedType=${ContractInteractionTabs.Execute}contract=${publicContractInfo.publicInfo.contractAddress}`}
          >
            <Button size="sm" variant="outline-gray">
              Execute
            </Button>
          </AppLink>
          <AppLink
            href={`/interact-contract?selectedType=${ContractInteractionTabs.Query}&contract=${publicContractInfo.publicInfo.contractAddress}`}
          >
            <Button size="sm" variant="outline-gray">
              Query
            </Button>
          </AppLink>
          <Box onClick={(e) => e.stopPropagation()}>
            {publicContractInfo.localInfo.lists ? (
              <AddToOtherListModal
                contractLocalInfo={publicContractInfo.localInfo}
                triggerElement={
                  <StyledIconButton
                    aria-label="button"
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
                    aria-label="button"
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
