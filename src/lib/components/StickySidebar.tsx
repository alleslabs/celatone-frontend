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
    align="center"
    cursor="pointer"
    borderRadius={4}
    p={1}
    gap={1}
    alignItems="center"
    width="fit-content"
    transition="all 0.25s ease-in-out"
    color="primary.main"
    _hover={{
      color: "primary.light",
      bgColor: "primary.background",
    }}
    onClick={onClick}
  >
    <Text variant="body3" color="primary.main" fontWeight={700}>
      {title}
    </Text>
    <CustomIcon name="chevron-right" color="primary.main" boxSize={3} m={0} />
  </Flex>
);

export const StickySidebar = ({
  metadata,
  hasForumAlert = false,
  ...boxProps
}: StickySidebarProps) => {
  const navigate = useInternalNavigate();
  const { title, description, toPagePath, toPageTitle, toPage, page } =
    metadata;
  const hasAction = toPage;
  return (
    <Box flex="4" px={8} position="relative" {...boxProps}>
      <Flex position="fixed" width="full" direction="column">
        {hasForumAlert && (
          <Alert variant="primary" gap="2" w={96} mb={2}>
            <Box>
              <Text variant="body2" fontWeight={600} color="primary">
                Forum Posting Required for Proposals
              </Text>
              <Text variant="body3" color="primary" mt={1}>
                Governance proposals must be posted as a draft on
                <Flex align="center" display="inline-flex">
                  <Link
                    href="https://forum.osmosis.zone"
                    target="_blank"
                    rel="noopener noreferrer"
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
          allowToggle
          width={96}
          defaultIndex={[0]}
          variant="transparent"
        >
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
              bg="transparent"
              py={3}
              px={0}
              borderTop="1px solid"
              borderColor="gray.700"
            >
              <Text
                variant="body2"
                color="text.dark"
                mb={hasAction ? 3 : 0}
                pb={2}
                p={1}
              >
                {description}
              </Text>
              {toPage && toPagePath && toPageTitle && (
                <ToPage
                  onClick={() => {
                    trackUseRightHelperPanel(page, `to-${toPagePath}`);
                    navigate({ pathname: toPagePath });
                  }}
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
