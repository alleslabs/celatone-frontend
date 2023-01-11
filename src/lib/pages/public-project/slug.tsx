import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Flex,
  TabPanel,
  Button,
  Icon,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { MdExpandMore } from "react-icons/md";

import { CustomTab } from "lib/components/CustomTab";
import { EmptyState } from "lib/components/state/EmptyState";

import { CodesTable } from "./components/CodesTable";
import { ContractsTable } from "./components/ContractsTable";
import { DetailHeader } from "./components/DetailHeader";
import { usePublicData } from "./data";

const ProjectDetail = observer(() => {
  const [tabIndex, setTabIndex] = useState(0);
  const { publicCodes, publicContracts, projectDetail, slug } = usePublicData();
  return (
    <Box py="48px" pb="0">
      <DetailHeader details={projectDetail} slug={slug} />
      <Tabs index={tabIndex}>
        <TabList my="32px" borderBottom="1px" px="48px" borderColor="gray.800">
          <CustomTab
            count={publicCodes.length + publicContracts.length}
            onClick={() => setTabIndex(0)}
          >
            Overview
          </CustomTab>
          <CustomTab
            onClick={() => setTabIndex(1)}
            isDisabled={!publicCodes.length}
            count={publicCodes.length}
          >
            Codes
          </CustomTab>
          <CustomTab
            onClick={() => setTabIndex(2)}
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
                <CodesTable
                  hasSearchInput={false}
                  codes={publicCodes.slice(0, 6)}
                />
                {publicCodes?.length > 5 ?? (
                  <Flex
                    w="full"
                    justifyContent="center"
                    textAlign="center"
                    py="4"
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      color="gray.500"
                      onClick={() => setTabIndex(1)}
                    >
                      View More <Icon as={MdExpandMore} boxSize={4} ml="1" />
                    </Button>
                  </Flex>
                )}
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
                  hasIcon={false}
                  message="There is currently no code in this project. Please check back soon for the updates."
                />
              </Flex>
            )}
            <Heading as="h6" variant="h6" mb={6} mt={12} px="48px">
              Contracts
            </Heading>
            {publicContracts.length ? (
              <Box>
                <ContractsTable
                  hasSearchInput={false}
                  contracts={publicContracts.slice(0, 6)}
                />
                {publicContracts?.length > 5 ?? (
                  <Flex
                    w="full"
                    justifyContent="center"
                    textAlign="center"
                    py="4"
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      color="gray.500"
                      onClick={() => setTabIndex(2)}
                    >
                      View More <Icon as={MdExpandMore} boxSize={4} ml="1" />
                    </Button>
                  </Flex>
                )}
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
                  hasIcon={false}
                  message="There is currently no contracts in this project. Please check back soon for the updates."
                />
              </Flex>
            )}
          </TabPanel>
          <TabPanel p="0px">
            <CodesTable codes={publicCodes} />
          </TabPanel>
          <TabPanel p="0px">
            <ContractsTable contracts={publicContracts} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
});

export default ProjectDetail;
