import type { BoxProps } from "@chakra-ui/react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";

import { trackUseRightHelperPanel } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";

import { CustomIcon } from "./icon";

export interface SidebarMetadata {
  description: React.ReactElement;
  page: string;
  title: string;
  toPage?: boolean;
  toPagePath?: string;
  toPageTitle?: string;
}

interface StickySidebarProps extends BoxProps {
  hasForumAlert?: boolean;
  metadata: SidebarMetadata;
}

interface ToPageProps {
  onClick: () => void;
  title: string;
}
const ToPage = ({ onClick, title }: ToPageProps) => (
  <Flex
    width="fit-content"
    align="center"
    alignItems="center"
    gap={1}
    p={1}
    _hover={{
      bgColor: "primary.background",
      color: "primary.light",
    }}
    borderRadius={4}
    color="primary.main"
    cursor="pointer"
    onClick={onClick}
    transition="all 0.25s ease-in-out"
  >
    <Text variant="body3" color="primary.main" fontWeight={700}>
      {title}
    </Text>
    <CustomIcon m={0} name="chevron-right" boxSize={3} color="primary.main" />
  </Flex>
);

export const StickySidebar = ({
  hasForumAlert = false,
  metadata,
  ...boxProps
}: StickySidebarProps) => {
  const navigate = useInternalNavigate();
  const { description, page, title, toPage, toPagePath, toPageTitle } =
    metadata;
  const hasAction = toPage;
  return (
    <Box flex={4} px={8} position="relative" {...boxProps}>
      <Flex width="full" direction="column" position="fixed">
        {hasForumAlert && (
          <Alert gap="2" mb={2} variant="primary" w={96}>
            <Box>
              <Text variant="body2" color="primary" fontWeight={600}>
                Forum Posting Required for Proposals
              </Text>
              <Text mt={1} variant="body3" color="primary">
                Governance proposals must be posted as a draft on
                <Flex align="center" display="inline-flex">
                  <Link
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://forum.osmosis.zone"
                  >
                    https://forum.osmosis.zone
                    <CustomIcon name="launch" boxSize={2} />
                  </Link>
                </Flex>{" "}
                for <b>at least three days</b> before being submitted to chain
                to allow feedback. Proposals that have not met these criteria
                should be met with `NoWithVeto`.
              </Text>
            </Box>
          </Alert>
        )}
        <Accordion
          width={96}
          defaultIndex={[0]}
          variant="transparent"
          allowToggle
        >
          <AccordionItem borderColor="gray.700" borderTop="none">
            <AccordionButton px={0} py={3}>
              <Text
                textAlign="start"
                variant="body2"
                color="text.main"
                fontWeight={700}
              >
                {title}
              </Text>
              <AccordionIcon ml="auto" color="gray.600" />
            </AccordionButton>
            <AccordionPanel
              bg="transparent"
              px={0}
              py={3}
              borderColor="gray.700"
              borderTop="1px solid"
            >
              <Text
                mb={hasAction ? 3 : 0}
                p={1}
                pb={2}
                variant="body2"
                color="text.dark"
              >
                {description}
              </Text>
              {toPage && toPagePath && toPageTitle && (
                <ToPage
                  title={toPageTitle}
                  onClick={() => {
                    trackUseRightHelperPanel(page, `to-${toPagePath}`);
                    navigate({ pathname: toPagePath });
                  }}
                />
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Box>
  );
};
