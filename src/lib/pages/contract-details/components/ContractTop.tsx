import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Text,
  Button,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import router from "next/router";
import {
  MdBookmark,
  MdBookmarkBorder,
  MdInput,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ContractDetail } from "lib/model/contract";
import { getFirstQueryParam } from "lib/utils";

interface ContractTopProps {
  contractDetail: ContractDetail;
}
export const ContractTop = ({ contractDetail }: ContractTopProps) => {
  const contractAddress = getFirstQueryParam(router.query.contractAddress);

  const { contractInfo } = contractDetail;
  const { instantiateInfo } = contractDetail;
  const { publicInfo } = contractDetail;

  const name = contractInfo?.name || publicInfo?.name || instantiateInfo?.label;

  const goToQuery = () => {
    router.push({
      pathname: "/query",
      query: { ...(contractAddress && { contract: contractAddress }) },
    });
  };

  const goToExecute = () => {
    router.push({
      pathname: "/execute",
      query: { ...(contractAddress && { contract: contractAddress }) },
    });
  };

  return (
    <Flex justify="space-between" my={6}>
      <Flex direction="column" gap={1} textOverflow="ellipsis" maxW="670px">
        <Heading as="h5" variant="h5" color="text.main" className="ellipsis">
          {name}
        </Heading>
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
            {contractDetail.instantiateInfo?.label}
          </Text>
        </Flex>
        {publicInfo?.name && !contractInfo?.lists && (
          <Flex gap={2}>
            <Text color="text.dark" variant="body2" fontWeight={500}>
              Public Contract Name:
            </Text>
            <Text variant="body2" className="ellipsis">
              {publicInfo?.name}
            </Text>
          </Flex>
        )}
      </Flex>
      <Flex gap={4} w="fit-content">
        {/* TODO - Revisit, implement admin button */}
        <Button
          variant="outline-gray"
          leftIcon={<Icon as={MdKeyboardArrowDown} boxSize="18px" />}
        >
          Admin
        </Button>
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
          {(contractInfo || contractDetail.contractInfo?.lists) && (
            <IconButton
              fontSize="22px"
              variant="none"
              aria-label="edit"
              icon={<RiPencilFill />}
            />
          )}
          {/* TODO - fix */}
          <IconButton
            fontSize="22px"
            variant="none"
            aria-label="save"
            color={contractInfo?.lists ? "primary.main" : "none"}
            icon={contractInfo?.lists ? <MdBookmark /> : <MdBookmarkBorder />}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
