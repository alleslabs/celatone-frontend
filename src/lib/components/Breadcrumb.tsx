import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem as ChakraBreadcrumbItem,
  Text,
} from "@chakra-ui/react";

import { AppLink } from "./AppLink";
import { CustomIcon } from "./icon";

interface BreadcrumbProps {
  primaryPage: string;
  primaryPath: string;
  secondaryPage?: string;
  secondaryPath?: string;
  currentPage: string;
  mb?: number;
}

export const Breadcrumb = ({
  primaryPage,
  primaryPath,
  secondaryPage = "",
  secondaryPath = "",
  currentPage,
  mb = 0,
}: BreadcrumbProps) => (
  <ChakraBreadcrumb
    w="full"
    spacing="4px"
    mb={mb}
    separator={<CustomIcon name="chevron-right" boxSize={3} />}
  >
    <ChakraBreadcrumbItem
      _hover={{ opacity: 0.8 }}
      transition="all 0.25s ease-in-out"
    >
      <AppLink color="text.dark" href={primaryPath}>
        {primaryPage}
      </AppLink>
    </ChakraBreadcrumbItem>
    {secondaryPage && (
      <ChakraBreadcrumbItem
        _hover={{ opacity: 0.8 }}
        transition="all 0.25s ease-in-out"
      >
        <AppLink color="text.dark" href={secondaryPath}>
          {secondaryPage}
        </AppLink>
      </ChakraBreadcrumbItem>
    )}
    <ChakraBreadcrumbItem isCurrentPage>
      <Text
        variant="body2"
        className="ellipsis"
        fontWeight="600"
        width="250px"
        color="text.dark"
      >
        {currentPage}
      </Text>
    </ChakraBreadcrumbItem>
  </ChakraBreadcrumb>
);
