import type { Nullish, WasmVerifyInfo } from "lib/types";

import { Button, Flex, Text } from "@chakra-ui/react";
import {
  useGetAddressTypeByLength,
  useInternalNavigate,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import { ContractInteractionTabs } from "lib/types";
import { getWasmVerifyStatus } from "lib/utils";

import type { PublicContractInfo } from ".";

interface PublicProjectContractMobileCardProps {
  publicContractInfo: PublicContractInfo;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const PublicProjectContractMobileCard = ({
  publicContractInfo: { publicInfo },
  wasmVerifyInfo,
}: PublicProjectContractMobileCardProps) => {
  const navigate = useInternalNavigate();
  const getAddressTypeByLength = useGetAddressTypeByLength();

  const goToContractDetails = () => {
    navigate({
      pathname: `/contracts/${publicInfo.contractAddress}`,
    });
  };

  return (
    <MobileCardTemplate
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column" flex={1}>
            <Flex direction="column">
              <MobileLabel label="Contract name" />
              <Text>{publicInfo.name}</Text>
              <Text color="text.dark" pt={1} variant="body3">
                {publicInfo.description}
              </Text>
            </Flex>
          </Flex>
          <Flex direction="column" flex={1}>
            <Flex direction="column">
              <MobileLabel label="Instantiated by" />
              <ExplorerLink
                showCopyOnHover
                type={getAddressTypeByLength(publicInfo.instantiator)}
                value={publicInfo.instantiator}
              />
            </Flex>
          </Flex>
        </Flex>
      }
      topContent={
        <>
          <Flex align="start" direction="column">
            <MobileLabel label="Contract address" variant="body2" />
            <ExplorerLink
              rightIcon={
                <WasmVerifyBadge
                  linkedCodeId={publicInfo.code}
                  relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
                  status={getWasmVerifyStatus(wasmVerifyInfo)}
                />
              }
              showCopyOnHover
              type="contract_address"
              value={publicInfo.contractAddress}
            />
          </Flex>
          <Flex
            alignItems="center"
            gap={3}
            justifyContent="center"
            onClick={(e) => e.stopPropagation()}
          >
            <AppLink
              href={`/interact-contract?selectedType=${ContractInteractionTabs.Query}&contract=${publicInfo.contractAddress}`}
            >
              <Button size="sm" variant="outline-gray">
                Query
              </Button>
            </AppLink>
          </Flex>
        </>
      }
      onClick={goToContractDetails}
    />
  );
};
