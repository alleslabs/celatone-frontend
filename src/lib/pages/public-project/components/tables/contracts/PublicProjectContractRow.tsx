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
  publicContractInfo: PublicContractInfo;
  templateColumns: string;
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
      minW="min-content"
      _hover={{ bg: "gray.900" }}
      cursor="pointer"
      onClick={goToContractDetails}
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
    >
      <TableRow>
        <ExplorerLink
          type={getAddressTypeByLength(
            publicContractInfo.publicInfo.contractAddress
          )}
          value={publicContractInfo.publicInfo.contractAddress}
          rightIcon={
            <WasmVerifyBadge
              status={getWasmVerifyStatus(wasmVerifyInfo)}
              linkedCodeId={publicContractInfo.publicInfo.code}
              relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
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
          type={getAddressTypeByLength(
            publicContractInfo.publicInfo.instantiator
          )}
          value={publicContractInfo.publicInfo.instantiator}
          showCopyOnHover
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
                triggerElement={
                  <StyledIconButton
                    aria-label="button"
                    variant="ghost-primary"
                    icon={<CustomIcon name="bookmark-solid" />}
                  />
                }
                contractLocalInfo={publicContractInfo.localInfo}
              />
            ) : (
              <SaveContractDetailsModal
                triggerElement={
                  <StyledIconButton
                    aria-label="button"
                    variant="ghost-gray"
                    icon={<CustomIcon name="bookmark" />}
                  />
                }
                contractLocalInfo={publicContractInfo.localInfo}
              />
            )}
          </Box>
        </Flex>
      </TableRow>
    </Grid>
  );
};
