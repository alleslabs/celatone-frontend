import { Button, Flex, Heading, Stack } from "@chakra-ui/react";
import { useAllowCustomNetworks } from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";
// import { CustomTab } from "lib/components/CustomTab";
import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { RemoveChainConfigModal } from "lib/components/modal/RemoveChainConfigModal";
import { InvalidState } from "lib/components/state";
import { useLocalChainConfigStore } from "lib/providers/store";
import { jsonPrettify } from "lib/utils";
import { isUndefined, pick } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { z } from "zod";

// import { ExportNetworkConfig } from "./components/ExportNetworkConfig";
// import { UpdateGasFeeDetails } from "./components/UpdateGasFeeDetails";
// import { UpdateNetworkDetails } from "./components/UpdateNetworkDetails";
// import { UpdateSupportedFeatures } from "./components/UpdateSupportedFeatures";
// import { UpdateWalletRegistry } from "./components/UpdateWalletRegistry";

// const StyledCustomTab = chakra(CustomTab, {
//   baseStyle: {
//     border: "unset",
//     borderRadius: "4px",
//     _selected: { bgColor: "gray.800" },
//     _hover: { bgColor: "gray.700" },
//   },
// });

// const StyledTabPanel = chakra(TabPanel, {
//   baseStyle: {
//     p: 0,
//     width: "550px",
//     minWidth: "550px",
//   },
// });

// const TabMenu = [
//   { name: "Network details", key: "network-details" },
//   { name: "Supported features", key: "supported-features" },
//   { name: "Gas & fee details", key: "gas-fee-details" },
//   { name: "Wallet registry", key: "wallet-registry" },
// ];

const InvalidChainId = () => <InvalidState title="Invalid chain ID" />;

interface NetworkConfigBodyProps {
  chainId: string;
}

const NetworkConfigBody = ({ chainId }: NetworkConfigBodyProps) => {
  const { getLocalChainConfig } = useLocalChainConfigStore();
  const chainConfig = getLocalChainConfig(chainId);
  const json = useMemo(() => {
    if (!chainConfig) return "";

    // NOTE: hardcoding so the order is fixed
    return JSON.stringify({
      chainId: chainConfig.chainId,
      features: pick(chainConfig.features, ["wasm", "move", "evm"]),
      fees: chainConfig.fees,
      gas: chainConfig.gas,
      logo_URIs: chainConfig.logo_URIs,
      prettyName: chainConfig.prettyName,
      registry: chainConfig.registry,
      registryChainName: chainConfig.registryChainName,
      rest: chainConfig.rest,
      rpc: chainConfig.rpc,
    });
  }, [chainConfig]);

  const handleExportJson = useCallback(() => {
    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chainId}.json`;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [chainId, json]);

  if (isUndefined(chainConfig)) return <InvalidChainId />;

  return (
    <ActionPageContainer width={900}>
      <CustomNetworkPageHeader
        hasAlert={false}
        subtitle="Your custom rollup"
        title={chainConfig.prettyName}
      />
      <Stack gap={12} mt={8} w="full">
        <Flex gap={10} justifyContent="space-between">
          <CustomNetworkSubheader
            subtitle="You can export this custom rollup configuration in JSON file to use them in other device."
            title="Export as JSON File"
          />
          <Button
            leftIcon={<CustomIcon name="download" />}
            minW={168}
            onClick={handleExportJson}
          >
            Export as JSON
          </Button>
        </Flex>
        <Stack gap={2}>
          <Heading as="h6" variant="h6">
            Current Configuration in JSON
          </Heading>
          <JsonReadOnly canCopy fullWidth text={jsonPrettify(json)} />
          <RemoveChainConfigModal
            chainId={chainId}
            trigger={
              <Button
                border="1px solid"
                borderColor="error.main"
                leftIcon={<CustomIcon name="delete" />}
                mt={10}
                size="md"
                variant="ghost-error"
              >
                Remove Network
              </Button>
            }
          />
        </Stack>
      </Stack>
    </ActionPageContainer>
  );

  // return (
  //   <>
  //     <ActionPageContainer width={900}>
  //       <CustomNetworkPageHeader
  //         title={chainConfig.prettyName}
  //         subtitle="Your custom rollup"
  //         hasAlert={false}
  //       />
  //       <Tabs variant="unstyled" orientation="vertical" mt={6}>
  //         <Grid templateColumns="2fr 5fr" gap={6} w="full" my={8}>
  //           <TabList w="full">
  //             {TabMenu.map((item) => (
  //               <StyledCustomTab key={item.key}>{item.name}</StyledCustomTab>
  //             ))}
  //             <StyledCustomTab pointerEvents="none" isDisabled>
  //               <Flex gap={2} align="center">
  //                 Export JSON <Tag size="xs">Soon</Tag>
  //               </Flex>
  //             </StyledCustomTab>
  //             <Button
  //               variant="outline-gray"
  //               mt={10}
  //               size="sm"
  //               leftIcon={<CustomIcon name="delete" />}
  //             >
  //               Remove Network
  //             </Button>
  //           </TabList>
  //           <TabPanels px={8} w="full">
  //             <StyledTabPanel>
  //               <UpdateNetworkDetails />
  //             </StyledTabPanel>
  //             <StyledTabPanel>
  //               <UpdateSupportedFeatures />
  //             </StyledTabPanel>
  //             <StyledTabPanel>
  //               " <UpdateGasFeeDetails />
  //             </StyledTabPanel>
  //             <StyledTabPanel>
  //               <UpdateWalletRegistry />
  //             </StyledTabPanel>
  //             <StyledTabPanel>
  //               <ExportNetworkConfig />
  //             </StyledTabPanel>
  //           </TabPanels>
  //         </Grid>
  //       </Tabs>
  //     </ActionPageContainer>
  //     <CustomNetworkFooterCta
  //       leftButtonProps={leftButtonProps}
  //       rightButtonProps={rightButtonProps}
  //       isCenterAlign={false}
  //     />
  //   </>
  // );
};

export const NetworkConfig = () => {
  useAllowCustomNetworks({ shouldRedirect: true });
  const router = useRouter();
  const validated = z.string().safeParse(router.query.chainId);

  if (!validated.success) return <InvalidChainId />;

  return <NetworkConfigBody chainId={validated.data} />;
};
