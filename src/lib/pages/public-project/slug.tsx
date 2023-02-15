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
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state/EmptyState";

import { DetailHeader } from "./components/DetailHeader";
import { PublicProjectCodeTable } from "./components/table/code/PublicProjectCodeTable";
import { PublicProjectContractTable } from "./components/table/contract/PublicProjectContractTable";
import { usePublicData } from "./data";

export const ProjectDetail = observer(() => {
  const [tabIndex, setTabIndex] = useState(0);
  const { publicCodes, publicContracts, projectDetail, slug, isLoading } =
    usePublicData();
  if (isLoading) return <Loading />;
  return (
    <Box py={12} pb={0}>
      <DetailHeader details={projectDetail} slug={slug} />
      <Tabs index={tabIndex}>
        <TabList my={8} borderBottom="1px" px={12} borderColor="pebble.800">
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

        <TabPanels my={8}>
          <TabPanel p={0}>
            <Heading as="h6" variant="h6" mb={6} px={12}>
              Codes
            </Heading>
            {publicCodes.length ? (
              <Box>
                <PublicProjectCodeTable
                  hasSearchInput={false}
                  codes={publicCodes.slice(0, 5)}
                />
                {publicCodes.length >= 5 && (
                  <Flex w="full" justifyContent="center" textAlign="center">
                    <Button
                      size="sm"
                      variant="ghost"
                      color="text.dark"
                      onClick={() => setTabIndex(1)}
                    >
                      View More <Icon as={MdExpandMore} boxSize={4} ml={1} />
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
                borderColor="pebble.700"
              >
                <EmptyState message="There is currently no code related to this project." />
              </Flex>
            )}
            <Heading as="h6" variant="h6" mb={6} mt={12} px="48px">
              Contracts
            </Heading>
            {publicContracts.length ? (
              <Box>
                <PublicProjectContractTable
                  hasSearchInput={false}
                  contracts={publicContracts.slice(0, 5)}
                />
                {publicCodes.length >= 5 && (
                  <Flex w="full" justifyContent="center" textAlign="center">
                    <Button
                      size="sm"
                      variant="ghost"
                      color="text.dark"
                      onClick={() => setTabIndex(2)}
                    >
                      View More <Icon as={MdExpandMore} boxSize={4} ml={1} />
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
                borderColor="pebble.700"
              >
                <EmptyState message="There is currently no contracts related to this project." />
              </Flex>
            )}
          </TabPanel>
          <TabPanel p={0}>
            <PublicProjectCodeTable codes={publicCodes} />
          </TabPanel>
          <TabPanel p={0}>
            <PublicProjectContractTable contracts={publicContracts} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
});
