import { Flex, Heading, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";

import { UserDocsLink } from "./UserDocsLink";

interface PageHeaderProps {
  docHref: string;
  subtitle?: string;
  title: string;
}

export const PageHeader = ({ docHref, subtitle, title }: PageHeaderProps) => {
  const isMobile = useMobile();
  return (
    <Flex alignItems="center" mb={8} w="full" justifyContent="space-between">
      <div style={{ width: "100%" }}>
        <Flex justifyContent="space-between">
          <Heading
            as="h5"
            minH="36px"
            variant="h5"
            color="text.main"
            fontWeight={600}
          >
            {title}
          </Heading>
          {isMobile && <UserDocsLink isButton href={docHref} />}
        </Flex>
        {subtitle && (
          <Text variant="body2" color="text.dark" fontWeight={500}>
            {subtitle}
          </Text>
        )}
      </div>
      {!isMobile && <UserDocsLink isButton href={docHref} />}
    </Flex>
  );
};
