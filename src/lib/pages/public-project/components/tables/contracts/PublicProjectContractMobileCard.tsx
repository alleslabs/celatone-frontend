import { Button, Flex, Text } from "@chakra-ui/react";

import {
  useGetAddressTypeByLength,
  useInternalNavigate,
} from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate, MobileLabel } from "lib/components/table";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import type { Nullish, WasmVerifyInfo } from "lib/types";
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
      onClick={goToContractDetails}
      topContent={
        <>
          <Flex align="start" direction="column">
            <MobileLabel variant="body2" label="Contract Address" />
            <ExplorerLink
              value={publicInfo.contractAddress}
              type="contract_address"
              rightIcon={
                <WasmVerifyBadge
                  status={getWasmVerifyStatus(wasmVerifyInfo)}
                  relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
                  linkedCodeId={publicInfo.code}
                />
              }
              showCopyOnHover
            />
          </Flex>
          <Flex
            gap={3}
            alignItems="center"
            justifyContent="center"
            onClick={(e) => e.stopPropagation()}
          >
            <AppLink
              href={`/interact-contract?selectedType=${ContractInteractionTabs.Query}&contract=${publicInfo.contractAddress}`}
            >
              <Button variant="outline-gray" size="sm">
                Query
              </Button>
            </AppLink>
          </Flex>
        </>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex flex="1" direction="column">
            <Flex direction="column">
              <MobileLabel label="Contract Name" />
              <Text>{publicInfo.name}</Text>
              <Text variant="body3" color="text.dark" pt={1}>
                {publicInfo.description}
              </Text>
            </Flex>
          </Flex>
          <Flex flex="1" direction="column">
            <Flex direction="column">
              <MobileLabel label="Instantiated By" />
              <ExplorerLink
                value={publicInfo.instantiator}
                type={getAddressTypeByLength(publicInfo.instantiator)}
                showCopyOnHover
              />
            </Flex>
          </Flex>
        </Flex>
      }
    />
  );
};
