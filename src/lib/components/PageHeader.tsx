import { Flex, Heading, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";

import { UserDocsLink } from "./UserDocsLink";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  docHref: string;
  mb?: number;
}

export const PageHeader = ({
  title,
  subtitle,
  docHref,
  mb = 0,
}: PageHeaderProps) => {
  const isMobile = useMobile();
  return (
    <Flex justifyContent="space-between" alignItems="center" mb={mb} zIndex={1}>
      <div style={{ width: "100%" }}>
        <Flex justifyContent="space-between">
          <Heading
            as="h5"
            variant="h5"
            color="text.main"
            fontWeight={600}
            minH="36px"
          >
            {title}
          </Heading>
          {isMobile && <UserDocsLink href={docHref} isButton />}
        </Flex>
        {subtitle && (
          <Text variant="body2" color="text.dark" fontWeight={500}>
            {subtitle}
          </Text>
        )}
      </div>
      {!isMobile && <UserDocsLink href={docHref} isButton />}
    </Flex>
  );
};
