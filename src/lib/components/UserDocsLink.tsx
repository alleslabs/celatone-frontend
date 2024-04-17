import { Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

import { trackWebsite } from "lib/amplitude";
import { DOCS_LINK } from "lib/data";

import { CustomIcon } from "./icon";

interface UserDocsLinkProps {
  href?: string;
  title?: string;
  cta?: string;
  isButton?: boolean;
  isSmall?: boolean;
  mt?: number;
}

export const UserDocsLink = ({
  title,
  cta,
  href,
  isButton = false,
  isSmall = true,
  mt = 8,
}: UserDocsLinkProps) =>
  isButton ? (
    <Link
      href={`${DOCS_LINK}/${href}`}
      onClick={(e) => {
        trackWebsite(`${DOCS_LINK}/${href}`);
        e.stopPropagation();
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button
        variant={{
          base: "ghost-primary",
          md: isSmall ? "ghost-primary" : "outline-primary",
        }}
        size={isSmall ? "sm" : "md"}
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
    >
      {title && (
        <Text color="text.main" variant="body2">
          {title}
        </Text>
      )}
      <Link
        href={`${DOCS_LINK}/${href}`}
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
                color: "secondary.light",
                textDecoration: "underline",
                transition: "all",
                transitionDuration: "0.25s",
                transitionTimingFunction: "ease-in-out",
              },
            },
          }}
        >
          <CustomIcon name="document" color="secondary.main" boxSize={3} />
          <Text color="secondary.main" variant="body2">
            {cta}
          </Text>
        </Flex>
      </Link>
    </Flex>
  );