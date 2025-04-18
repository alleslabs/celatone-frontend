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
import { trackUseRightHelperPanel } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import Link from "next/link";

import { CustomIcon } from "./icon";

export interface SidebarMetadata {
  page: string;
  title: string;
  description: React.ReactElement;
  toPagePath?: string;
  toPageTitle?: string;
  toPage?: boolean;
}

interface StickySidebarProps extends BoxProps {
  metadata: SidebarMetadata;
  hasForumAlert?: boolean;
}

interface ToPageProps {
  onClick: () => void;
  title: string;
}
const ToPage = ({ onClick, title }: ToPageProps) => (
  <Flex
    _hover={{
      bgColor: "primary.background",
      color: "primary.light",
    }}
    align="center"
    alignItems="center"
    borderRadius={4}
    color="primary.main"
    cursor="pointer"
    gap={1}
    p={1}
    transition="all 0.25s ease-in-out"
    width="fit-content"
    onClick={onClick}
  >
    <Text color="primary.main" fontWeight={700} variant="body3">
      {title}
    </Text>
    <CustomIcon boxSize={3} color="primary.main" m={0} name="chevron-right" />
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
    <Box flex={4} position="relative" px={8} {...boxProps}>
      <Flex direction="column" position="fixed" width="full">
        {hasForumAlert && (
          <Alert gap="2" mb={2} variant="primary" w={96}>
            <Box>
              <Text color="primary" fontWeight={600} variant="body2">
                Forum Posting Required for Proposals
              </Text>
              <Text color="primary" mt={1} variant="body3">
                Governance proposals must be posted as a draft on
                <Flex align="center" display="inline-flex">
                  <Link
                    href="https://forum.osmosis.zone"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    https://forum.osmosis.zone
                    <CustomIcon boxSize={2} name="launch" />
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
          allowToggle
          defaultIndex={[0]}
          variant="transparent"
          width={96}
        >
          <AccordionItem borderColor="gray.700" borderTopWidth="none">
            <AccordionButton px={0} py={3}>
              <Text
                color="text.main"
                fontWeight={700}
                textAlign="start"
                variant="body2"
              >
                {title}
              </Text>
              <AccordionIcon color="gray.600" ml="auto" />
            </AccordionButton>
            <AccordionPanel
              bg="transparent"
              borderColor="gray.700"
              borderTopWidth="1px"
              px={0}
              py={3}
            >
              <Text
                color="text.dark"
                mb={hasAction ? 3 : 0}
                p={1}
                pb={2}
                variant="body2"
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
