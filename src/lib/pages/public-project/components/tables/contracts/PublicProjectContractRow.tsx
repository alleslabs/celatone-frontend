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
import type { Nullish, WasmVerifyInfo } from "lib/types";
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
    display: "flex",
    alignItems: "center",
    fontSize: "22px",
    borderRadius: "36px",
  },
});

export const PublicProjectContractRow = ({
  templateColumns,
  publicContractInfo,
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
      templateColumns={templateColumns}
      onClick={goToContractDetails}
      _hover={{ bg: "gray.900" }}
      transition="all 0.25s ease-in-out"
      cursor="pointer"
      minW="min-content"
    >
      <TableRow>
        <ExplorerLink
          value={publicContractInfo.publicInfo.contractAddress}
          type={getAddressTypeByLength(
            publicContractInfo.publicInfo.contractAddress
          )}
          rightIcon={
            <WasmVerifyBadge
              status={getWasmVerifyStatus(wasmVerifyInfo)}
              relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
              linkedCodeId={publicContractInfo.publicInfo.code}
            />
          }
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
            href={`/interact-contract?selectedType=${ContractInteractionTabs.Execute}contract=${publicContractInfo.publicInfo.contractAddress}`}
          >
            <Button variant="outline-gray" size="sm">
              Execute
            </Button>
          </AppLink>
          <AppLink
            href={`/interact-contract?selectedType=${ContractInteractionTabs.Query}&contract=${publicContractInfo.publicInfo.contractAddress}`}
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
