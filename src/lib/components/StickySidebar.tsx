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

import { useInternalNavigate } from "lib/app-provider";

import { CustomIcon } from "./icon";

export interface SidebarMetadata {
  title: string;
  description: React.ReactElement;
  toStoreCode?: boolean;
}

interface StickySidebarProps extends BoxProps {
  metadata: SidebarMetadata;
}

export const StickySidebar = ({
  metadata,
  ...boxProps
}: StickySidebarProps) => {
  const navigate = useInternalNavigate();
  const { title, description, toStoreCode } = metadata;
  const hasAction = toStoreCode;
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
                  color="lilac.main"
                  _hover={{
                    color: "lilac.light",
                    bgColor: "lilac.background",
                  }}
                  onClick={() => navigate({ pathname: "/proposal/store-code" })}
                >
                  <Text variant="body3" color="inherit" fontWeight={700}>
                    Submit Proposal To Store Code
                  </Text>
                  <CustomIcon
                    name="chevron-right"
                    color="lilac.main"
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
