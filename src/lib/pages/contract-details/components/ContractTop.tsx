import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Text,
  Button,
  Icon,
  IconButton,
  Image,
} from "@chakra-ui/react";
import router from "next/router";
import { MdBookmark, MdBookmarkBorder, MdInput } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";

import { useInternalNavigate } from "lib/app-provider";
import { AdminButton } from "lib/components/button";
import { ExplorerLink } from "lib/components/ExplorerLink";
import {
  AddToOtherListModal,
  EditContractDetailsModal,
  SaveContractDetailsModal,
} from "lib/components/modal";
import type { ContractData } from "lib/model/contract";
import type { ContractAddr } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

interface ContractTopProps {
  contractData: ContractData;
}
export const ContractTop = ({ contractData }: ContractTopProps) => {
  const navigate = useInternalNavigate();
  const { contractLocalInfo, instantiateInfo, publicProject } = contractData;
  const contractAddress = getFirstQueryParam(router.query.contractAddress);

  const displayName =
    contractLocalInfo?.name ||
    publicProject.publicInfo?.name ||
    instantiateInfo?.label;

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
              color={contractLocalInfo.lists ? "violet.light" : "pebble.600"}
              icon={
                contractLocalInfo.lists ? <MdBookmark /> : <MdBookmarkBorder />
              }
            />
          }
        />
      );
    }
    if (instantiateInfo) {
      return (
        <SaveContractDetailsModal
          contractLocalInfo={{
            contractAddress: contractAddress as ContractAddr,
            instantiator: instantiateInfo.instantiator,
            label: instantiateInfo.label,
          }}
          triggerElement={
            <IconButton
              fontSize="24px"
              variant="none"
              aria-label="save"
              color="pebble.600"
              icon={<MdBookmarkBorder />}
            />
          }
        />
      );
    }
    return null;
  };

  return (
    <Flex justify="space-between" my={6}>
      <Flex direction="column" gap={1} textOverflow="ellipsis" maxW="670px">
        <Flex gap={1}>
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
        <Flex gap={2}>
          <Text
            color="text.dark"
            variant="body2"
            fontWeight={500}
            whiteSpace="nowrap"
          >
            Contract Address:
          </Text>
          <ExplorerLink
            type="contract_address"
            value={contractAddress}
            textFormat="normal"
            maxWidth="none"
          />
        </Flex>
        <Flex gap={2}>
          <Text color="text.dark" variant="body2" fontWeight={500}>
            Label:
          </Text>
          <Text variant="body2" className="ellipsis">
            {contractData.instantiateInfo?.label}
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
      </Flex>
      <Flex gap={4}>
        <AdminButton
          contractAddress={contractAddress as ContractAddr}
          admin={instantiateInfo?.admin}
        />
        <Button
          variant="outline-primary"
          leftIcon={<SearchIcon />}
          onClick={goToQuery}
        >
          Query
        </Button>
        <Button
          variant="outline-primary"
          leftIcon={<Icon as={MdInput} boxSize="18px" />}
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
                  color="pebble.600"
                  icon={<RiPencilFill />}
                />
              }
            />
          )}
          {renderSaveButton()}
        </Flex>
      </Flex>
    </Flex>
  );
};
