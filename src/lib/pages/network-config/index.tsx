import {
  Button,
  chakra,
  Flex,
  Grid,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import ActionPageContainer from "lib/components/ActionPageContainer";
import {
  CustomNetworkFooterCta,
  CustomNetworkPageHeader,
} from "lib/components/custom-network";
import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";

import { ExportNetworkConfig } from "./components/ExportNetworkConfig";
import { UpdateGasFeeDetails } from "./components/UpdateGasFeeDetails";
import { UpdateNetworkDetails } from "./components/UpdateNetworkDetails";
import { UpdateSupportedFeatures } from "./components/UpdateSupportedFeatures";
import { UpdateWalletRegistry } from "./components/UpdateWalletRegistry";

const StyledCustomTab = chakra(CustomTab, {
  baseStyle: {
    border: "unset",
    borderRadius: "4px",
    _selected: { bgColor: "gray.800" },
    _hover: { bgColor: "gray.700" },
  },
});

const StyledTabPanel = chakra(TabPanel, {
  baseStyle: {
    p: 0,
    width: "550px",
    minWidth: "550px",
  },
});

const TabMenu = [
  { name: "Network Details", key: "network-details" },
  { name: "Supported Features", key: "supported-features" },
  { name: "Gas & Fee Details", key: "gas-fee-details" },
  { name: "Wallet Registry", key: "wallet-registry" },
];

export const NetworkConfig = () => {
  const forms = [
    <UpdateNetworkDetails />,
    <UpdateSupportedFeatures />,
    <UpdateGasFeeDetails />,
    <UpdateWalletRegistry />,
  ];

  const leftButtonProps = {
    label: "Cancel",
    action: () => {},
    variant: "outline-secondary",
  };

  const rightButtonProps = {
    label: "Update",
    action: () => {},
    variant: "primary",
  };

  return (
    <>
      <ActionPageContainer width={900}>
        <CustomNetworkPageHeader
          title="CHAIN_NAME"
          subtitle="Your Custom Minitia"
          hasAlert={false}
        />
        <Tabs variant="unstyled" orientation="vertical" mt={6}>
          <Grid templateColumns="2fr 5fr" gap={6} w="full" my={8}>
            <TabList w="full">
              {TabMenu.map((item) => (
                <StyledCustomTab key={item.key}>{item.name}</StyledCustomTab>
              ))}
              <StyledCustomTab>
                <Flex gap={2} align="center">
                  Export JSON
                </Flex>
              </StyledCustomTab>
              <Button
                variant="outline-gray"
                mt={10}
                size="sm"
                leftIcon={<CustomIcon name="delete" />}
              >
                Remove Network
              </Button>
            </TabList>
            <TabPanels px={8} w="full">
              {forms.map((item) => (
                <StyledTabPanel>{item}</StyledTabPanel>
              ))}
              <StyledTabPanel>
                <ExportNetworkConfig />
              </StyledTabPanel>
            </TabPanels>
          </Grid>
        </Tabs>
      </ActionPageContainer>
      <CustomNetworkFooterCta
        leftButtonProps={leftButtonProps}
        rightButtonProps={rightButtonProps}
        isCenterAlign={false}
      />
    </>
  );
};
