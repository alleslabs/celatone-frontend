import {
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  Image,
} from "@chakra-ui/react";

import type { ContractData } from "../types";
import { useInternalNavigate } from "lib/app-provider";
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
import type { ContractAddr } from "lib/types";
import { truncate } from "lib/utils";

interface ContractTopProps {
  contractAddress: ContractAddr;
  contractLocalInfo: ContractData["contractLocalInfo"];
  publicProject: ContractData["publicProject"];
  contractDetail: ContractData["contractDetail"];
  rawContractResponse: ContractData["rawContractResponse"];
}
export const ContractTop = ({
  contractAddress,
  contractLocalInfo,
  publicProject,
  contractDetail,
  rawContractResponse,
}: ContractTopProps) => {
  const navigate = useInternalNavigate();

  const displayName =
    contractLocalInfo?.name ||
    publicProject.publicInfo?.name ||
    contractDetail?.label;

  const publicName = publicProject.publicDetail?.name;
  const goToQuery = () => {
    navigate({
      pathname: "/query",
      query: { ...(contractAddress && { contract: contractAddress }) },
    });
  };

  const goToExecute = () => {
    navigate({
      pathname: "/execute",
      query: { ...(contractAddress && { contract: contractAddress }) },
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
    if (contractDetail) {
      return (
        <SaveContractDetailsModal
          contractLocalInfo={{
            contractAddress: contractAddress as ContractAddr,
            instantiator: contractDetail.instantiator,
            label: contractDetail.label,
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
    }
    return null;
  };

  return (
    <Flex justify="space-between" mb={6}>
      <Flex direction="column" w="full">
        <Breadcrumb
          items={[
            {
              text: publicName ? "Public Projects" : "Contracts",
              href: publicName ? "/projects" : "/contracts",
            },
            {
              text: publicName,
              href: `/projects/${publicProject.publicInfo?.slug}`,
            },
            { text: truncate(contractAddress) },
          ]}
          mb={6}
        />

        <Flex direction="column" gap={2} textOverflow="ellipsis" w="full">
          <Flex justify="space-between" align="center">
            <Flex gap={1} maxW="670px">
              <CustomIcon
                name="contract-address"
                boxSize="5"
                color="secondary.main"
              />
              {publicProject.publicDetail?.logo && (
                <Image
                  src={publicProject.publicDetail.logo}
                  borderRadius="full"
                  alt={publicProject.publicDetail.name}
                  width={7}
                  height={7}
                />
              )}
              <Heading as="h5" variant="h5" className="ellipsis">
                {displayName}
              </Heading>
            </Flex>
            <Flex gap={4}>
              <AdminButton
                contractAddress={contractAddress as ContractAddr}
                admin={contractDetail?.admin}
              />
              <Button
                variant="outline-primary"
                leftIcon={<CustomIcon name="query" color="primary.light" />}
                onClick={goToQuery}
              >
                Query
              </Button>
              <Button
                variant="outline-primary"
                leftIcon={<CustomIcon name="execute" color="primary.light" />}
                onClick={goToExecute}
              >
                Execute
              </Button>
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
            </Flex>
          </Flex>
          <Flex direction="column" gap={1}>
            <Flex gap={2}>
              <Text
                color="text.dark"
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
            <Flex gap={2}>
              <Text color="text.dark" variant="body2" fontWeight={500}>
                Label:
              </Text>
              <Text variant="body2" className="ellipsis">
                {contractDetail?.label ??
                  rawContractResponse?.contract_info.label}
              </Text>
            </Flex>
            {publicProject.publicInfo?.name && (
              <Flex gap={2}>
                <Text color="text.dark" variant="body2" fontWeight={500}>
                  Public Contract Name:
                </Text>
                <Text variant="body2" className="ellipsis">
                  {publicProject.publicInfo?.name}
                </Text>
              </Flex>
            )}
            {publicProject.publicInfo?.github && (
              <GitHubLink github={publicProject.publicInfo?.github} />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
