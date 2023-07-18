import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem as ChakraBreadcrumbItem,
  Text,
} from "@chakra-ui/react";

import type { Option } from "lib/types";

import { AppLink } from "./AppLink";
import { CustomIcon } from "./icon";

type BreadcrumbItemProps = {
  text: Option<string>;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItemProps[];
  mb?: number;
};

export const Breadcrumb = ({ items, mb = 0 }: BreadcrumbProps) => (
  <ChakraBreadcrumb
    w="full"
    spacing="4px"
    mb={mb}
    separator={
      <CustomIcon name="chevron-right" boxSize={3} color="gray.600" mb="6px" />
    }
  >
    {items.map((item) =>
      item.href ? (
        item.text && (
          <ChakraBreadcrumbItem
            _hover={{ opacity: 0.8 }}
            transition="all 0.25s ease-in-out"
            key={`bc-${item.href}`}
          >
            <AppLink color="text.dark" href={item.href}>
              {item.text}
            </AppLink>
          </ChakraBreadcrumbItem>
        )
      ) : (
        <ChakraBreadcrumbItem isCurrentPage key={`bc-${item.href}`}>
          <Text
            variant={{ base: "body3", md: "body2" }}
            className="ellipsis"
            fontWeight={600}
            width="250px"
            color="text.dark"
          >
            {item.text}
          </Text>
        </ChakraBreadcrumbItem>
      )
    )}
  </ChakraBreadcrumb>
);
