import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

import { Breadcrumb } from "lib/components/Breadcrumb";
import type { Option, PublicDetail } from "lib/types";
import { getNameAndDescriptionDefault } from "lib/utils";

import { BookmarkButton } from "./BookmarkButton";
import { SocialMedia } from "./SocialMedia";

interface DetailHeaderProps {
  details: Option<PublicDetail>;
  slug: string;
}
export const DetailHeader = ({ details, slug }: DetailHeaderProps) => (
  <>
    <Breadcrumb
      items={[
        { href: "/projects", text: "Public Projects" },
        { text: details?.name },
      ]}
    />
    <Flex
      alignItems="flex-start"
      gap={5}
      mt={6}
      w="full"
      direction={{ base: "column", md: "row" }}
      justifyContent="space-between"
    >
      <Box>
        <Flex align="center" gap={1} minH="36px">
          {details?.logo && (
            <Image
              width={7}
              alt="Celatone"
              height={7}
              src={details?.logo}
              borderRadius="full"
            />
          )}
          <Heading className="ellipsis" as="h5" variant="h5">
            {getNameAndDescriptionDefault(details?.name)}
          </Heading>
        </Flex>
        <Text mt={2} variant="body2" color="text.dark">
          {getNameAndDescriptionDefault(details?.description)}
        </Text>
      </Box>
      <Flex
        alignItems="center"
        gap={4}
        justify="space-between"
        w={{ base: "full", md: "auto" }}
      >
        <SocialMedia details={details} />
        <BookmarkButton details={details} slug={slug} />
      </Flex>
    </Flex>
  </>
);
