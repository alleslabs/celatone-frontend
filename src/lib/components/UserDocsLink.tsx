import type { ButtonProps } from "@chakra-ui/react";
import { Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

import { trackWebsite } from "lib/amplitude";
import { DEVELOPER_TOOL_DOCS_LINK, USER_GUIDE_DOCS_LINK } from "lib/data";

import { CustomIcon } from "./icon";

interface UserDocsLinkProps {
  href?: string;
  title?: string;
  cta?: string;
  isButton?: boolean;
  isInline?: boolean;
  isDevTool?: boolean;
  mt?: number;
}

export const UserDocsLink = ({
  title,
  cta,
  href,
  isButton = false,
  isInline = false,
  isDevTool = false,
  mt = 8,
}: UserDocsLinkProps) =>
  isButton ? (
    <Link
      href={`${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`}
      onClick={(e) => {
        trackWebsite(
          `${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`
        );
        e.stopPropagation();
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button
        variant="ghost-primary"
        size="sm"
        leftIcon={<CustomIcon name="document" boxSize={3} />}
      >
        View Doc
      </Button>
    </Link>
  ) : (
    <Flex
      gap={{ base: 1, md: 2 }}
      alignItems="center"
      mt={mt}
      direction={{ base: "column", md: "row" }}
      display={isInline ? "inline-flex" : "flex"}
    >
      {title && (
        <Text color="text.main" variant="body2">
          {title}
        </Text>
      )}
      <Link
        href={`${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Flex
          gap={1}
          alignItems="center"
          sx={{
            cursor: "pointer",
            "&:hover": {
              "> *": {
                color: "primary.light",
                textDecoration: "underline",
                transition: "all",
                transitionDuration: "0.25s",
                transitionTimingFunction: "ease-in-out",
              },
            },
          }}
        >
          <CustomIcon name="document" color="primary.main" boxSize={3} />
          <Text color="primary.main" fontWeight={800} variant="body2">
            {cta}
          </Text>
        </Flex>
      </Link>
    </Flex>
  );

interface UserDocButtonProps extends ButtonProps {
  title: string;
  href: string;
  isDevTool: boolean;
}

export const UserDocButton = ({
  title,
  href,
  isDevTool,
  ...props
}: UserDocButtonProps) => (
  <Link
    href={`${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`}
    onClick={(e) => {
      trackWebsite(
        `${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`
      );
      e.stopPropagation();
    }}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button leftIcon={<CustomIcon name="document" boxSize={3} />} {...props}>
      {title}
    </Button>
  </Link>
);
