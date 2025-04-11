import type { Option } from "lib/types";

import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem as ChakraBreadcrumbItem,
  Text,
} from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";

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
    mb={mb}
    separator={
      <CustomIcon boxSize={3} color="gray.600" mb="6px" name="chevron-right" />
    }
    spacing="4px"
    w="full"
  >
    {items.map((item) =>
      item.href ? (
        item.text && (
          <ChakraBreadcrumbItem
            key={`bc-${item.href}`}
            _hover={{ opacity: 0.8 }}
            transition="all 0.25s ease-in-out"
          >
            <AppLink
              color="text.dark"
              href={item.href}
              onClick={() => track(AmpEvent.USE_BREADCRUMB)}
            >
              {item.text}
            </AppLink>
          </ChakraBreadcrumbItem>
        )
      ) : (
        <ChakraBreadcrumbItem key={`bc-${item.text}`} isCurrentPage>
          <Text
            className="ellipsis"
            color="text.main"
            fontWeight={600}
            variant={{ base: "body3", md: "body2" }}
          >
            {item.text}
          </Text>
        </ChakraBreadcrumbItem>
      )
    )}
  </ChakraBreadcrumb>
);
