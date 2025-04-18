import { Button, Flex, Text } from "@chakra-ui/react";
import { trackWebsite } from "lib/amplitude";
import { DEVELOPER_TOOL_DOCS_LINK, USER_GUIDE_DOCS_LINK } from "lib/data";
import Link from "next/link";

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
      href={`${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`}
      rel="noopener noreferrer"
      target="_blank"
      onClick={(e) => {
        trackWebsite(
          `${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`
        );
        e.stopPropagation();
      }}
    >
      <Button
        leftIcon={<CustomIcon boxSize={3} name="document" />}
        size="sm"
        variant="ghost-primary"
      >
        View doc
      </Button>
    </Link>
  ) : (
    <Flex
      alignItems="center"
      direction={{ base: "column", md: "row" }}
      display={isInline ? "inline-flex" : "flex"}
      gap={{ base: 1, md: 2 }}
      mt={mt}
    >
      {title && (
        <Text color="text.main" variant="body2">
          {title}
        </Text>
      )}
      <Link
        href={`${isDevTool ? DEVELOPER_TOOL_DOCS_LINK : USER_GUIDE_DOCS_LINK}/${href}`}
        rel="noopener noreferrer"
        target="_blank"
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
          <CustomIcon boxSize={3} color="primary.main" name="document" />
          <Text color="primary.main" fontWeight={800} variant="body2">
            {cta}
          </Text>
        </Flex>
      </Link>
    </Flex>
  );
