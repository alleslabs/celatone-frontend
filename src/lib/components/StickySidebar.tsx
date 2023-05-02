import type { BoxProps } from "@chakra-ui/react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";

import {
  useCurrentNetwork,
  useInternalNavigate,
  useSelectChain,
} from "lib/app-provider";
import type { Network } from "lib/data";
import { getChainNameByNetwork } from "lib/data";

import { CustomIcon } from "./icon";

export interface SidebarMetadata {
  title: string;
  description: React.ReactElement;
  toNetwork?: boolean;
  toPagePath?: string;
  toPageTitle?: string;
  toPage?: boolean;
}

export type SidebarDetails = Record<Network, SidebarMetadata>;

interface StickySidebarProps extends BoxProps {
  metadata: SidebarDetails;
}

interface ToPageProps {
  onClick: () => void;
  title: string;
}
const ToPage = ({ onClick, title }: ToPageProps) => (
  <Flex
    align="center"
    cursor="pointer"
    borderRadius={8}
    p={1}
    gap={2}
    width="fit-content"
    transition="all 0.25s ease-in-out"
    color="lilac.main"
    _hover={{
      color: "lilac.light",
      bgColor: "lilac.background",
    }}
    onClick={onClick}
  >
    <Text variant="body3" color="inherit" fontWeight={700}>
      {title}
    </Text>
    <CustomIcon name="chevron-right" color="lilac.main" boxSize={3} m={0} />
  </Flex>
);

export const StickySidebar = ({
  metadata,
  ...boxProps
}: StickySidebarProps) => {
  const navigate = useInternalNavigate();
  const selectChain = useSelectChain();
  const { isMainnet } = useCurrentNetwork();
  const { network } = useCurrentNetwork();
  const { title, description, toNetwork, toPagePath, toPageTitle, toPage } =
    metadata[network];
  const hasAction = toPage;
  return (
    <Box flex="4" px={8} position="relative" {...boxProps}>
      <Flex position="fixed" width="full">
        <Accordion allowToggle width={96} defaultIndex={[0]}>
          <AccordionItem borderTop="none" borderColor="pebble.700">
            <AccordionButton py={3} px={0}>
              <Text
                variant="body2"
                fontWeight={700}
                color="text.main"
                textAlign="start"
              >
                {title}
              </Text>
              <AccordionIcon color="pebble.600" ml="auto" />
            </AccordionButton>
            <AccordionPanel
              py={3}
              px={0}
              borderTop="1px solid"
              borderColor="pebble.700"
            >
              <Text
                variant="body2"
                color="text.dark"
                mb={hasAction ? 3 : 0}
                pb={2}
              >
                {description}
              </Text>
              {toNetwork && (
                <ToPage
                  onClick={() =>
                    selectChain(
                      getChainNameByNetwork(isMainnet ? "testnet" : "mainnet")
                    )
                  }
                  title={isMainnet ? "Switch To Testnet" : "Switch To Mainnet"}
                />
              )}
              {toPage && toPagePath && toPageTitle && (
                <ToPage
                  onClick={() => navigate({ pathname: toPagePath })}
                  title={toPageTitle}
                />
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Box>
  );
};
