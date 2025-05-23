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
          contractLocalInfo={contractLocalInfo}
          triggerElement={
            <IconButton
              aria-label="save"
              fontSize="24px"
              icon={
                contractLocalInfo.lists ? (
                  <CustomIcon color="primary.light" name="bookmark-solid" />
                ) : (
                  <CustomIcon color="gray.600" name="bookmark" />
                )
              }
              size={{ base: "sm", md: "md" }}
              variant="none"
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
            aria-label="save"
            color="gray.600"
            fontSize="24px"
            icon={<CustomIcon name="bookmark" />}
            variant="none"
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
            href: projectName ? "/projects" : "/contracts",
            text: projectName ? "Public projects" : "Contracts",
          },
          {
            href: `/projects/${publicInfo?.slug}`,
            text: projectName,
          },
          { text: truncate(contractAddress) },
        ]}
      />
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ md: 4 }}
        justify="space-between"
        mt={{ base: 3, md: 6 }}
      >
        <Flex direction="column" gap={{ base: 1, md: 3 }} overflow="hidden">
          <Flex align="center" gap={1}>
            <CustomIcon
              boxSize={5}
              color="primary.main"
              name="contract-address"
            />
            {projectInfo && (
              <Image
                alt={projectInfo.name}
                borderRadius="full"
                height={7}
                src={projectInfo.logo}
                width={7}
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
              linkedCodeId={contract.codeId}
              relatedVerifiedCodes={wasmVerifyInfo?.relatedVerifiedCodes}
              status={getWasmVerifyStatus(wasmVerifyInfo)}
            />
          </Flex>
          <Flex direction="column" gap={{ base: 2, md: 1 }}>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 0, md: 2 }}
              mt={{ base: 2, md: 0 }}
            >
              <Text
                color="text.dark"
                fontWeight={500}
                minW={32}
                variant="body2"
                whiteSpace="nowrap"
              >
                Contract address:
              </Text>
              <CopyLink
                amptrackSection="contract_top"
                type="contract_address"
                value={contractAddress}
              />
            </Flex>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 0, md: 2 }}
            >
              <Text
                color="text.dark"
                fontWeight={500}
                minW={32}
                variant="body2"
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
                  fontWeight={500}
                  minW={32}
                  variant="body2"
                >
                  Public name:
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
        <Flex direction="column" gap={4}>
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
              leftIcon={<CustomIcon name="query" />}
              size={{ base: "sm", md: "md" }}
              variant="outline-primary"
              w={{ base: "full", md: "auto" }}
              onClick={() =>
                goToInteractContract(ContractInteractionTabs.Query)
              }
            >
              Query
            </Button>
            <Button
              isDisabled={isMobile}
              leftIcon={<CustomIcon name="execute" />}
              size={{ base: "sm", md: "md" }}
              variant="outline-primary"
              w={{ base: "full", md: "auto" }}
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
                    contractLocalInfo={contractLocalInfo}
                    triggerElement={
                      <IconButton
                        aria-label="edit"
                        color="gray.600"
                        fontSize="24px"
                        icon={<CustomIcon name="edit" />}
                        variant="none"
                      />
                    }
                  />
                )}
                {renderSaveButton()}
              </Flex>
            )}
          </Flex>
          <TotalValue address={contractAddress} isCompact label="Total value" />
        </Flex>
      </Flex>
    </Flex>
  );
};
