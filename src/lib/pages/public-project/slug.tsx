import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Flex,
  TabPanel,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { MdManageSearch } from "react-icons/md";

import { CustomTab } from "lib/components/CustomTab";
import { EmptyState } from "lib/components/state/EmptyState";

import { CodesTable } from "./components/CodesTable";
import { ContractsTable } from "./components/ContractsTable";
import { DetailHeader } from "./components/DetailHeader";
import { usePublicData } from "./data";

const ProjectDetail = observer(() => {
  const { publicCodes, publicContracts, projectDetail, slug } = usePublicData();
  return (
    <Box py="48px" pb="0">
      <DetailHeader details={projectDetail} slug={slug} />
      <Tabs>
        <TabList my="32px" borderBottom="1px" px="48px" borderColor="gray.800">
          <CustomTab count={publicCodes.length + publicContracts.length}>
            Overview
          </CustomTab>
          <CustomTab
            isDisabled={!publicCodes.length}
            count={publicCodes.length}
          >
            Codes
          </CustomTab>
          <CustomTab
            isDisabled={!publicContracts.length}
            count={publicContracts.length}
          >
            Contracts
          </CustomTab>
        </TabList>

        <TabPanels my="32px">
          <TabPanel p="0px">
            <Heading as="h6" variant="h6" mb={6} px="48px">
              Codes
            </Heading>
            {publicCodes.length ? (
              <Box>
                <CodesTable codes={publicCodes.slice(0, 6)} />
              </Box>
            ) : (
              <Flex
                my={6}
                py={6}
                width="full"
                borderBottom="1px solid"
                borderTop="1px solid"
                borderColor="divider.main"
              >
                <EmptyState
                  icon={MdManageSearch}
                  message="There is currently no code in this project. Please check back soon for the updates."
                />
              </Flex>
            )}
            <Heading as="h6" variant="h6" mb={6} mt={12} px="48px">
              Contracts
            </Heading>
            {publicContracts.length ? (
              <Box>
                <ContractsTable contracts={publicContracts.slice(0, 6)} />
              </Box>
            ) : (
              <Flex
                my={6}
                py={6}
                width="full"
                borderBottom="1px solid"
                borderTop="1px solid"
                borderColor="divider.main"
              >
                <EmptyState
                  icon={MdManageSearch}
                  message="There is currently no contracts in this project. Please check back soon for the updates."
                />
              </Flex>
            )}
          </TabPanel>
          <TabPanel p="0px">
            {/* TODO: Search input with placeholder "Search with Code ID or Code Description" */}
            <CodesTable codes={publicCodes} />
          </TabPanel>
          <TabPanel p="0px">
            {/* TODO: Search input with placeholder "Search with contract address or contract description" */}
            <ContractsTable contracts={publicContracts} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
});

export default ProjectDetail;
