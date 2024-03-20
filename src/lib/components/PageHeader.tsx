import { Flex, Heading, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";

import { UserDocsLink } from "./UserDocsLink";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  docHref: string;
}
export const PageHeader = ({ title, subtitle, docHref }: PageHeaderProps) => {
  const isMobile = useMobile();
  return (
    <Flex w="full" justifyContent="space-between" alignItems="center" mb={8}>
      <Flex w="full" direction="column">
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
        <Text variant="body2" color="text.dark" fontWeight={500}>
          {subtitle}
        </Text>
      </Flex>
      {!isMobile && <UserDocsLink href={docHref} isButton />}
    </Flex>
  );
};
