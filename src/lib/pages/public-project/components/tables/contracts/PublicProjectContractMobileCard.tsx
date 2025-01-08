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
      middleContent={
        <Flex gap={3} direction="column">
          <Flex flex={1} direction="column">
            <Flex direction="column">
              <MobileLabel label="Contract Name" />
              <Text>{publicInfo.name}</Text>
              <Text pt={1} variant="body3" color="text.dark">
                {publicInfo.description}
              </Text>
            </Flex>
          </Flex>
          <Flex flex={1} direction="column">
            <Flex direction="column">
              <MobileLabel label="Instantiated By" />
              <ExplorerLink
                type={getAddressTypeByLength(publicInfo.instantiator)}
                value={publicInfo.instantiator}
                showCopyOnHover
              />
            </Flex>
          </Flex>
        </Flex>
      }
      onClick={goToContractDetails}
      topContent={
        <>
          <Flex align="start" direction="column">
            <MobileLabel label="Contract Address" variant="body2" />
            <ExplorerLink
              type="contract_address"
              value={publicInfo.contractAddress}
              rightIcon={
                <WasmVerifyBadge
                  status={getWasmVerifyStatus(wasmVerifyInfo)}
                  linkedCodeId={publicInfo.code}
                  relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
                />
              }
              showCopyOnHover
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
    />
  );
};
