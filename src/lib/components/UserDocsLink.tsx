import { Button, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

import { CustomIcon } from "./icon";

interface UserDocsLinkProps {
  href: string;
  title?: string;
  cta?: string;
  isButton?: boolean;
  isSmall?: boolean;
}

export const UserDocsLink = ({
  title,
  cta,
  href,
  isButton = false,
  isSmall = true,
}: UserDocsLinkProps) => {
  const baseLink = "https://docs.alleslabs.com/";
  return isButton ? (
    <Link
      href={`${baseLink}/${href}`}
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
      mt={8}
      direction={{ base: "column", md: "row" }}
    >
      <Text color="text.main" variant="body2">
        {title}
      </Text>
      <Link
        href={`${baseLink}/${href}`}
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
          <Text color="primary.main" variant="body2">
            {cta}
          </Text>
        </Flex>
      </Link>
    </Flex>
  );
};
