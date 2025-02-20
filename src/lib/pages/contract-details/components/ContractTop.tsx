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
  contractAddress: BechAddr32;
  projectInfo: Nullable<ProjectInfo>;
  publicInfo: Nullable<PublicContractInfo>;
  contract: Contract;
  contractLocalInfo: Option<ContractLocalInfo>;
  wasmVerifyInfo: Nullish<WasmVerifyInfo>;
}

export const ContractTop = ({
  contractAddress,
  projectInfo,
  publicInfo,
  contract,
  contractLocalInfo,
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
          contractLocalInfo={contractLocalInfo}
          triggerElement={
            <IconButton
              fontSize="24px"
              variant="none"
              size={{ base: "sm", md: "md" }}
              aria-label="save"
              icon={
                contractLocalInfo.lists ? (
                  <CustomIcon name="bookmark-solid" color="primary.light" />
                ) : (
                  <CustomIcon name="bookmark" color="gray.600" />
                )
              }
            />
          }
        />
      );
    }

    return (
      <SaveContractDetailsModal
        contractLocalInfo={{
          contractAddress,
          instantiator: contract.instantiator,
          label: contract.label,
        }}
        triggerElement={
          <IconButton
            fontSize="24px"
            variant="none"
            aria-label="save"
            color="gray.600"
            icon={<CustomIcon name="bookmark" />}
          />
        }
      />
    );
  };

  return (
    <Flex direction="column" mb={6}>
      <Breadcrumb
        items={[
          {
            text: projectName ? "Public Projects" : "Contracts",
            href: projectName ? "/projects" : "/contracts",
          },
          {
            text: projectName,
            href: `/projects/${publicInfo?.slug}`,
          },
          { text: truncate(contractAddress) },
        ]}
      />
      <Flex
        justify="space-between"
        mt={{ base: 3, md: 6 }}
        direction={{ base: "column", md: "row" }}
        gap={{ md: 4 }}
      >
        <Flex direction="column" gap={{ base: 1, md: 3 }} overflow="hidden">
          <Flex gap={1} align="center">
            <CustomIcon
              name="contract-address"
              boxSize={5}
              color="primary.main"
            />
            {projectInfo && (
              <Image
                src={projectInfo.logo}
                borderRadius="full"
                alt={projectInfo.name}
                width={7}
                height={7}
              />
            )}
            <Heading
              as="h5"
              variant={{ base: "h6", md: "h5" }}
              wordBreak="break-word"
              display="inline"
            >
              {displayName}
            </Heading>
            <WasmVerifyBadge
              status={getWasmVerifyStatus(wasmVerifyInfo)}
              relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
              linkedCodeId={contract.codeId}
            />
          </Flex>
          <Flex gap={{ base: 2, md: 1 }} direction="column">
            <Flex
              mt={{ base: 2, md: 0 }}
              gap={{ base: 0, md: 2 }}
              direction={{ base: "column", md: "row" }}
            >
              <Text
                color="text.dark"
                minW={32}
                variant="body2"
                fontWeight={500}
                whiteSpace="nowrap"
              >
                Contract Address:
              </Text>
              <CopyLink
                value={contractAddress}
                amptrackSection="contract_top"
                type="contract_address"
              />
            </Flex>
            <Flex
              gap={{ base: 0, md: 2 }}
              direction={{ base: "column", md: "row" }}
            >
              <Text
                color="text.dark"
                minW={32}
                variant="body2"
                fontWeight={500}
              >
                Label:
              </Text>
              <Text variant="body2" wordBreak="break-word">
                {contract.label}
              </Text>
            </Flex>
            {publicInfo?.name && (
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: 0, md: 2 }}
              >
                <Text
                  color="text.dark"
                  minW={32}
                  variant="body2"
                  fontWeight={500}
                >
                  Public Name:
                </Text>
                <Text variant="body2" className="ellipsis">
                  {publicInfo.name}
                </Text>
              </Flex>
            )}
            {publicInfo?.github && (
              <GitHubLink github={publicInfo?.github} hasMinW />
            )}
          </Flex>
        </Flex>
        <Flex direction="column" gap={4}>
          <Flex
            gap={2}
            mt={{ base: 8, md: 0 }}
            w={{ base: "full", md: "auto" }}
          >
            {!isMobile && (
              <AdminButton
                contractAddress={contractAddress}
                admin={contract.admin}
              />
            )}
            <Button
              variant="outline-primary"
              w={{ base: "full", md: "auto" }}
              leftIcon={<CustomIcon name="query" />}
              onClick={() =>
                goToInteractContract(ContractInteractionTabs.Query)
              }
              size={{ base: "sm", md: "md" }}
            >
              Query
            </Button>
            <Button
              variant="outline-primary"
              w={{ base: "full", md: "auto" }}
              leftIcon={<CustomIcon name="execute" />}
              onClick={() => {
                goToInteractContract(ContractInteractionTabs.Execute);
              }}
              size={{ base: "sm", md: "md" }}
              isDisabled={isMobile}
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
                    contractLocalInfo={contractLocalInfo}
                    triggerElement={
                      <IconButton
                        fontSize="24px"
                        variant="none"
                        aria-label="edit"
                        color="gray.600"
                        icon={<CustomIcon name="edit" />}
                      />
                    }
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
