import { Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

import { trackWebsite } from "lib/amplitude";
import { DEVELOPER_TOOL_DOCS_LINK, USER_GUIDE_DOCS_LINK } from "lib/data";

import { CustomIcon } from "./icon";

interface UserDocsLinkProps {
  cta?: string;
  href?: string;
  isButton?: boolean;
  isDevTool?: boolean;
  isInline?: boolean;
  mt?: number;
  title?: string;
}

export const UserDocsLink = ({
  cta,
  href,
  isButton = false,
  isDevTool = false,
  isInline = false,
  mt = 8,
  title,
}: UserDocsLinkProps) =>
  isButton ? (
    <Link
      rel="noopener noreferrer"
      target="_blank"
      onClick={(e) => {
        trackWebsite(
          `${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`
        );
        e.stopPropagation();
      }}
      href={`${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`}
    >
      <Button
        size="sm"
        variant="ghost-primary"
        leftIcon={<CustomIcon name="document" boxSize={3} />}
      >
        View Doc
      </Button>
    </Link>
  ) : (
    <Flex
      alignItems="center"
      display={isInline ? "inline-flex" : "flex"}
      gap={{ base: 1, md: 2 }}
      mt={mt}
      direction={{ base: "column", md: "row" }}
    >
      {title && (
        <Text variant="body2" color="text.main">
          {title}
        </Text>
      )}
      <Link
        rel="noopener noreferrer"
        target="_blank"
        href={`${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`}
      >
        <Flex
          alignItems="center"
          gap={1}
          sx={{
            "&:hover": {
              "> *": {
                color: "primary.light",
                textDecoration: "underline",
                transition: "all",
                transitionDuration: "0.25s",
                transitionTimingFunction: "ease-in-out",
              },
            },
            cursor: "pointer",
          }}
        >
          <CustomIcon name="document" boxSize={3} color="primary.main" />
          <Text variant="body2" color="primary.main" fontWeight={800}>
            {cta}
          </Text>
        </Flex>
      </Link>
    </Flex>
  );
