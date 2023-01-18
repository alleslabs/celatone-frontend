import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Flex,
  Heading,
  Image,
} from "@chakra-ui/react";
import { MdChevronRight } from "react-icons/md";

import { AppLink } from "lib/components/AppLink";
import type { Option } from "lib/types";
import type { Detail } from "lib/types/projects";

import { BookmarkButton } from "./BookmarkButton";
import { SocialMedia } from "./SocialMedia";

interface DetailProps {
  details: Option<Detail>;
  slug: string;
}
export const DetailHeader = ({ details, slug }: DetailProps) => {
  return (
    <Box px={12}>
      <Breadcrumb
        w="full"
        spacing={1}
        separator={<MdChevronRight color="gray.600" />}
      >
        <BreadcrumbItem>
          <AppLink color="text.dark" href="/public-project">
            Public Projects
          </AppLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">
            <Text
              variant="body2"
              className="ellipsis"
              width="250px"
              fontWeight="600"
              color="text.dark"
            >
              {details?.name}
            </Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex
        justifyContent="space-between"
        alignItems="flex-start"
        w="full"
        mt={2}
        gap={5}
      >
        <Box>
          <Flex gap={2} align="center">
            <Image
              src={details?.logo}
              borderRadius="full"
              alt="Celatone"
              width={8}
              height={8}
            />
            <Heading
              as="h5"
              variant="h5"
              color="primary.400"
              className="ellipsis"
            >
              {details?.name}
            </Heading>
          </Flex>
          <Text variant="body2" color="text.dark" mt={2}>
            {details?.description}
          </Text>
        </Box>
        <Flex alignItems="center" gap={4}>
          <SocialMedia details={details} />
          <BookmarkButton details={details} slug={slug} />
        </Flex>
      </Flex>
    </Box>
  );
};
