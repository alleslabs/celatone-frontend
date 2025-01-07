import {
  Breadcrumb as ChakraBreadcrumb,
  BreadcrumbItem as ChakraBreadcrumbItem,
  Text,
} from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import type { Option } from "lib/types";

import { AppLink } from "./AppLink";
import { CustomIcon } from "./icon";

type BreadcrumbItemProps = {
  href?: string;
  text: Option<string>;
};

type BreadcrumbProps = {
  items: BreadcrumbItemProps[];
  mb?: number;
};

export const Breadcrumb = ({ items, mb = 0 }: BreadcrumbProps) => (
  <ChakraBreadcrumb
    mb={mb}
    spacing="4px"
    w="full"
    separator={
      <CustomIcon mb="6px" name="chevron-right" boxSize={3} color="gray.600" />
    }
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
              onClick={() => track(AmpEvent.USE_BREADCRUMB)}
              href={item.href}
            >
              {item.text}
            </AppLink>
          </ChakraBreadcrumbItem>
        )
      ) : (
        <ChakraBreadcrumbItem key={`bc-${item.text}`} isCurrentPage>
          <Text
            className="ellipsis"
            variant={{ base: "body3", md: "body2" }}
            color="text.main"
            fontWeight={600}
          >
            {item.text}
          </Text>
        </ChakraBreadcrumbItem>
      )
    )}
  </ChakraBreadcrumb>
);
