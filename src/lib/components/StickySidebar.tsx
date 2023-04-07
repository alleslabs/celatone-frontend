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
import type { ReactElement } from "react";

import { CustomIcon } from "./icon";
import { SwitchToTestnet } from "./SwitchToTestnet";

interface StickySidebarProps extends BoxProps {
  title?: string;
  description?: ReactElement;
  testnetSwitch?: boolean;
  action?: boolean;
}

export const StickySidebar = ({
  title = " Why do I need to submit proposal?",
  description = (
    <span>
      Osmosis Mainnet is permissioned chain, which means you will need to submit
      proposal to store code.
      <br />
      <br /> Another way is to get your wallet address to allow list to store
      code without opening proposal.
      <br />
      <br /> You still can upload your Wasm to see how your code works on
      Testnet.
    </span>
  ),
  testnetSwitch = true,
  action = false,
  ...boxProps
}: StickySidebarProps) => {
  return (
    <Box flex="4" px={8} position="relative" {...boxProps}>
      <Flex position="fixed" width="100%">
        <Accordion allowToggle width={96} defaultIndex={[0]}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" py={2} textAlign="left">
                  <Text variant="body2" fontWeight="600" color="text.main">
                    {title}
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text variant="body2" color="text.dark" pb={4}>
                {description}
              </Text>
              {testnetSwitch && (
                <SwitchToTestnet
                  color="lilac.main"
                  colorHover="lilac.light"
                  bgHover="lilac.background"
                  padding="1"
                  icon={
                    <CustomIcon
                      name="chevron-right"
                      color="lilac.main"
                      boxSize="3"
                    />
                  }
                />
              )}
              {action && (
                <Text
                  size="md"
                  cursor="pointer"
                  borderRadius={8}
                  pl="2"
                  width="fit-content"
                  transition="all 0.25s ease-in-out"
                  color="lilac.main"
                  py="1"
                  _hover={{ color: "lilac.light", bgColor: "lilac.background" }}
                >
                  Submit proposal to store code
                  <CustomIcon
                    name="chevron-right"
                    color="lilac.main"
                    boxSize={3}
                  />
                </Text>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Box>
  );
};
