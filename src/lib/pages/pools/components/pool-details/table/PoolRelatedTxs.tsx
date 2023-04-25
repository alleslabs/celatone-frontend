import {
  Flex,
  Heading,
  Box,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";

import { CustomTab } from "lib/components/CustomTab";

export const PoolRelatedTxs = () => {
  return (
    <Box>
      <Flex mt={12} gap={2} alignItems="center">
        <Heading as="h6" variant="h6">
          Related Transactions
        </Heading>
      </Flex>
      <Tabs>
        <TabList mt={4} borderBottom="1px" borderColor="pebble.800">
          <CustomTab count={0}>All</CustomTab>
          <CustomTab count={0}>Swap</CustomTab>
          <CustomTab count={0}>LP</CustomTab>
          <CustomTab count={0}>Bonding</CustomTab>
          <CustomTab count={0}>Superfluid</CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>All</TabPanel>
          <TabPanel p={0}>
            Swappppppp Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Delectus beatae esse doloremque eaque dolores magni harum pariatur,
            corporis aliquid at quam quod fuga fugit sit a ipsam culpa tempora
            voluptate?
          </TabPanel>
          <TabPanel p={0}>
            LPLPLPLPLPLLPLP Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Delectus beatae esse doloremque eaque dolores magni harum
            pariatur, corporis aliquid at quam quod fuga fugit sit a ipsam culpa
            tempora voluptate?
          </TabPanel>
          <TabPanel p={0}>
            BondingBondingBonding Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Delectus beatae esse doloremque eaque dolores
            magni harum pariatur, corporis aliquid at quam quod fuga fugit sit a
            ipsam culpa tempora voluptate?
          </TabPanel>
          <TabPanel p={0}>
            SuperfluidSuperfluid Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Delectus beatae esse doloremque eaque dolores
            magni harum pariatur, corporis aliquid at quam quod fuga fugit sit a
            ipsam culpa tempora voluptate?
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
