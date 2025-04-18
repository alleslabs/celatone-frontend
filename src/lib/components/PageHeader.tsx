import { Flex, Heading, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";

import { UserDocsLink } from "./UserDocsLink";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  docHref: string;
}

export const PageHeader = ({ docHref, subtitle, title }: PageHeaderProps) => {
  const isMobile = useMobile();
  return (
    <Flex alignItems="center" justifyContent="space-between" mb={8} w="full">
      <div style={{ width: "100%" }}>
        <Flex justifyContent="space-between">
          <Heading as="h5" color="text.main" minH="36px" variant="h5">
            {title}
          </Heading>
          {isMobile && <UserDocsLink href={docHref} isButton />}
        </Flex>
        {subtitle && (
          <Text color="text.dark" fontWeight={500} variant="body2">
            {subtitle}
          </Text>
        )}
      </div>
      {!isMobile && <UserDocsLink href={docHref} isButton />}
    </Flex>
  );
};
