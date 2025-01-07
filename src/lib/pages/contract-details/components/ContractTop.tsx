import {
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { AdminButton } from "lib/components/button";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { GitHubLink } from "lib/components/links";
import {
  AddToOtherListModal,
  EditContractDetailsModal,
  SaveContractDetailsModal,
} from "lib/components/modal";
import { TotalValue } from "lib/components/TotalValue";
import { WasmVerifyBadge } from "lib/components/WasmVerifyBadge";
import type { Contract } from "lib/services/types";
import type { ContractLocalInfo } from "lib/stores/contract";
import type {
  BechAddr32,
  Nullable,
  Nullish,
  Option,
  ProjectInfo,
  PublicContractInfo,
  WasmVerifyInfo,
} from "lib/types";
import { ContractInteractionTabs } from "lib/types";
import { getWasmVerifyStatus, truncate } from "lib/utils";

interface ContractTopProps {
  contract: Contract;
  contractAddress: BechAddr32;
  contractLocalInfo: Option<ContractLocalInfo>;
  projectInfo: Nullable<ProjectInfo>;
  publicInfo: Nullable<PublicContractInfo>;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const ContractTop = ({
  contract,
  contractAddress,
  contractLocalInfo,
  projectInfo,
  publicInfo,
  wasmVerifyInfo,
}: ContractTopProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();

  const displayName =
    contractLocalInfo?.name || publicInfo?.name || contract.label;
  const projectName = projectInfo?.name;

  const goToInteractContract = (type: ContractInteractionTabs) => {
    navigate({
      pathname: "/interact-contract",
      query: {
        selectedType: type,
        ...(contractAddress && { contract: contractAddress }),
      },
    });
  };

  const renderSaveButton = () => {
    if (contractLocalInfo) {
      return (
        <AddToOtherListModal
          triggerElement={
            <IconButton
              aria-label="save"
              size={{ base: "sm", md: "md" }}
              variant="none"
              fontSize="24px"
              icon={
                contractLocalInfo.lists ? (
                  <CustomIcon name="bookmark-solid" color="primary.light" />
                ) : (
                  <CustomIcon name="bookmark" color="gray.600" />
                )
              }
            />
          }
          contractLocalInfo={contractLocalInfo}
        />
      );
    }

    return (
      <SaveContractDetailsModal
        triggerElement={
          <IconButton
            aria-label="save"
            variant="none"
            color="gray.600"
            fontSize="24px"
            icon={<CustomIcon name="bookmark" />}
          />
        }
        contractLocalInfo={{
          contractAddress,
          instantiator: contract.instantiator,
          label: contract.label,
        }}
      />
    );
  };

  return (
    <Flex mb={6} direction="column">
      <Breadcrumb
        items={[
          {
            href: projectName ? "/projects" : "/contracts",
            text: projectName ? "Public Projects" : "Contracts",
          },
          {
            href: `/projects/${publicInfo?.slug}`,
            text: projectName,
          },
          { text: truncate(contractAddress) },
        ]}
      />
      <Flex
        gap={{ md: 4 }}
        justify="space-between"
        mt={{ base: 3, md: 6 }}
        direction={{ base: "column", md: "row" }}
      >
        <Flex gap={{ base: 1, md: 3 }} direction="column" overflow="hidden">
          <Flex align="center" gap={1}>
            <CustomIcon
              name="contract-address"
              boxSize={5}
              color="primary.main"
            />
            {projectInfo && (
              <Image
                width={7}
                alt={projectInfo.name}
                height={7}
                src={projectInfo.logo}
                borderRadius="full"
              />
            )}
            <Heading
              as="h5"
              display="inline"
              variant={{ base: "h6", md: "h5" }}
              wordBreak="break-word"
            >
              {displayName}
            </Heading>
            <WasmVerifyBadge
              status={getWasmVerifyStatus(wasmVerifyInfo)}
              linkedCodeId={contract.codeId}
              relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
            />
          </Flex>
          <Flex gap={{ base: 2, md: 1 }} direction="column">
            <Flex
              gap={{ base: 0, md: 2 }}
              mt={{ base: 2, md: 0 }}
              direction={{ base: "column", md: "row" }}
            >
              <Text
                minW={32}
                variant="body2"
                whiteSpace="nowrap"
                color="text.dark"
                fontWeight={500}
              >
                Contract Address
              </Text>
              <CopyLink
                type="contract_address"
                value={contractAddress}
                amptrackSection="contract_top"
              />
            </Flex>
            <Flex
              gap={{ base: 0, md: 2 }}
              direction={{ base: "column", md: "row" }}
            >
              <Text
                minW={32}
                variant="body2"
                color="text.dark"
                fontWeight={500}
              >
                Label
              </Text>
              <Text variant="body2" wordBreak="break-word">
                {contract.label}
              </Text>
            </Flex>
            {publicInfo?.name && (
              <Flex
                gap={{ base: 0, md: 2 }}
                direction={{ base: "column", md: "row" }}
              >
                <Text
                  minW={32}
                  variant="body2"
                  color="text.dark"
                  fontWeight={500}
                >
                  Public Name
                </Text>
                <Text className="ellipsis" variant="body2">
                  {publicInfo.name}
                </Text>
              </Flex>
            )}
            {publicInfo?.github && (
              <GitHubLink github={publicInfo?.github} hasMinW />
            )}
          </Flex>
        </Flex>
        <Flex gap={4} direction="column">
          <Flex
            gap={2}
            mt={{ base: 8, md: 0 }}
            w={{ base: "full", md: "auto" }}
          >
            {!isMobile && (
              <AdminButton
                admin={contract.admin}
                contractAddress={contractAddress}
              />
            )}
            <Button
              size={{ base: "sm", md: "md" }}
              variant="outline-primary"
              w={{ base: "full", md: "auto" }}
              leftIcon={<CustomIcon name="query" />}
              onClick={() =>
                goToInteractContract(ContractInteractionTabs.Query)
              }
            >
              Query
            </Button>
            <Button
              isDisabled={isMobile}
              size={{ base: "sm", md: "md" }}
              variant="outline-primary"
              w={{ base: "full", md: "auto" }}
              leftIcon={<CustomIcon name="execute" />}
              onClick={() => {
                goToInteractContract(ContractInteractionTabs.Execute);
              }}
            >
              {isMobile ? (
                <Tooltip label="Sorry, this feature is currently not supported on mobile.">
                  <span>Execute</span>
                </Tooltip>
              ) : (
                "Execute"
              )}
            </Button>
            {!isMobile && (
              <Flex>
                {contractLocalInfo && (
                  <EditContractDetailsModal
                    triggerElement={
                      <IconButton
                        aria-label="edit"
                        variant="none"
                        color="gray.600"
                        fontSize="24px"
                        icon={<CustomIcon name="edit" />}
                      />
                    }
                    contractLocalInfo={contractLocalInfo}
                  />
                )}
                {renderSaveButton()}
              </Flex>
            )}
          </Flex>
          <TotalValue address={contractAddress} label="Total Value" isCompact />
        </Flex>
      </Flex>
    </Flex>
  );
};
