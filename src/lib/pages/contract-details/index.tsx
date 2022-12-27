import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  Icon,
  Text,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MdBookmark, MdInput } from "react-icons/md";

import { BackButton } from "lib/components/button/BackButton";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import PageContainer from "lib/components/PageContainer";
import { useContractDetail } from "lib/model/contract";
import type { ContractAddr } from "lib/types";
import { getFirstQueryParam, jsonPrettify } from "lib/utils";

import { CommandSection } from "./components/CommandSection";
import { InstantiateInfo } from "./components/InstantiateInfo";
import { JsonInfo } from "./components/JsonInfo";
import { TokenSection } from "./components/TokenSection";

const ContractDetails = () => {
  /**
   * @todos add contract address validation function here
   */
  const router = useRouter();
  const contractAddressParam = getFirstQueryParam(
    router.query.contractAddress
  ) as ContractAddr;

  const contractDetails = useContractDetail(contractAddressParam);

  return (
    <PageContainer>
      <BackButton />
      {/* Contract name/address/label Section */}
      {/* TODO: Wireup data and buttons functionality */}
      <Flex justify="space-between" my={6}>
        <Flex direction="column" gap={1}>
          <Heading as="h5" variant="h5" color="text.main">
            Contract Name Section Goes Hereeeee
          </Heading>
          <Flex gap={2}>
            <Text color="text.dark" variant="body2" fontWeight={500}>
              Contract Address:
            </Text>
            <ExplorerLink
              type="contract_address"
              value={contractAddressParam}
              textFormat="normal"
              maxWidth="none"
            />
          </Flex>
          <Flex gap={2}>
            <Text color="text.dark" variant="body2" fontWeight={500}>
              Label:
            </Text>
            <Text variant="body2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
            </Text>
          </Flex>
        </Flex>
        <Flex gap={4}>
          <Button
            variant="outline-gray"
            leftIcon={<Icon as={MdBookmark} boxSize="18px" />}
          >
            Add to list
          </Button>
          <Button variant="outline-primary" leftIcon={<SearchIcon />}>
            Query
          </Button>
          <Button
            variant="outline-primary"
            leftIcon={<Icon as={MdInput} boxSize="18px" />}
          >
            Execute
          </Button>
        </Flex>
      </Flex>
      {/* Tokens Section */}
      <TokenSection />
      {/* Contract Description Section */}
      {/* TODO: Show real description, show View Full Description when the desc is too long */}
      <Flex
        direction="column"
        bg="gray.900"
        borderRadius="8px"
        p={4}
        gap={2}
        my={6}
      >
        <Text variant="body2" fontWeight={500} color="text.dark">
          Your Contract Description
        </Text>
        <Text variant="body2" color="text.dark">
          Save contract to lists to add your own contract description ...
        </Text>
      </Flex>
      {/* Query/Execute commands section */}
      <CommandSection />
      {/* Instantiate/Contract Info Section */}
      <Flex my={12} justify="space-between">
        {/* Instantiate Info */}
        <InstantiateInfo />
        {/* Contract Info (Expand) */}
        <Flex direction="column" flex={0.8} gap={4}>
          <JsonInfo
            header="Contract Info"
            jsonString={JSON.stringify(
              contractDetails?.instantiateInfo?.raw.contract_info ?? "",
              null,
              2
            )}
            jsonAreaHeight="180px"
          />
          <JsonInfo
            header="Instantiate Messages"
            jsonString={jsonPrettify(contractDetails?.initMsg ?? "")}
            showViewFullButton
          />
        </Flex>
      </Flex>
      {/* History Table section */}
      <Heading as="h6" variant="h6" mb={6}>
        History
      </Heading>
      <Tabs>
        <TabList border="none" mb="32px">
          <CustomTab count={100}>All</CustomTab>
          <CustomTab count={50}>Executes</CustomTab>
          <CustomTab count={20}>Migration</CustomTab>
          <CustomTab count={12}>Related Proposals</CustomTab>
        </TabList>
        {/* TODOs: Wireup with real table data, Make table component, and render each table with different data under each TabPanel */}
        <TabPanels>
          <TabPanel p={0}>
            <Heading as="h6" variant="h6" color="error.main">
              All Table
            </Heading>
          </TabPanel>
          <TabPanel p={0}>
            <Heading as="h6" variant="h6" color="error.main">
              Executes Table
            </Heading>
          </TabPanel>
          <TabPanel p={0}>
            <Heading as="h6" variant="h6" color="error.main">
              Migration Table
            </Heading>
          </TabPanel>
          <TabPanel p={0}>
            <Heading as="h6" variant="h6" color="error.main">
              Related Proposals Table
            </Heading>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageContainer>
  );
};

export default ContractDetails;
