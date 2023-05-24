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

import { useCurrentNetwork, useInternalNavigate } from "lib/app-provider";
import type { Network } from "lib/data";

import { CustomIcon } from "./icon";

export interface SidebarMetadata {
  title: string;
  description: React.ReactElement;
  toStoreCode?: boolean;
}

export type SidebarDetails = Record<Network, SidebarMetadata>;

interface StickySidebarProps extends BoxProps {
  metadata: SidebarDetails;
}

export const StickySidebar = ({
  metadata,
  ...boxProps
}: StickySidebarProps) => {
  const navigate = useInternalNavigate();
  const { network } = useCurrentNetwork();
  const { title, description, toStoreCode } = metadata[network];
  const hasAction = toStoreCode;
  return (
    <Box flex="4" px={8} position="relative" {...boxProps}>
      <Flex position="fixed" width="full">
        <Accordion allowToggle width={96} defaultIndex={[0]}>
          <AccordionItem borderTop="none" borderColor="gray.700">
            <AccordionButton py={3} px={0}>
              <Text
                variant="body2"
                fontWeight={700}
                color="text.main"
                textAlign="start"
              >
                {title}
              </Text>
              <AccordionIcon color="gray.600" ml="auto" />
            </AccordionButton>
            <AccordionPanel
              py={3}
              px={0}
              borderTop="1px solid"
              borderColor="gray.700"
            >
              <Text variant="body2" color="text.dark" mb={hasAction ? 3 : 0}>
                {description}
              </Text>
              {toStoreCode && (
                <Flex
                  align="center"
                  cursor="pointer"
                  borderRadius={8}
                  p={1}
                  gap={2}
                  width="fit-content"
                  transition="all 0.25s ease-in-out"
                  color="secondary.main"
                  _hover={{
                    color: "secondary.light",
                    bgColor: "secondary.background",
                  }}
                  onClick={() =>
                    navigate({ pathname: "/proposals/store-code" })
                  }
                >
                  <Text variant="body3" color="inherit" fontWeight={700}>
                    Submit Proposal To Store Code
                  </Text>
                  <CustomIcon
                    name="chevron-right"
                    color="secondary.main"
                    boxSize={3}
                    m={0}
                  />
                </Flex>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Box>
  );
};
