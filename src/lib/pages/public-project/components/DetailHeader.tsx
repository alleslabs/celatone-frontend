import type { Option, PublicDetail } from "lib/types";

import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { Breadcrumb } from "lib/components/Breadcrumb";
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
        { href: "/projects", text: "Public projects" },
        { text: details?.name },
      ]}
    />
    <Flex
      alignItems="flex-start"
      direction={{ base: "column", md: "row" }}
      gap={5}
      justifyContent="space-between"
      mt={6}
      w="full"
    >
      <Box>
        <Flex align="center" gap={1} minH="36px">
          {details?.logo && (
            <Image
              alt="Scan"
              borderRadius="full"
              height={7}
              src={details?.logo}
              width={7}
            />
          )}
          <Heading className="ellipsis" as="h5" variant="h5">
            {getNameAndDescriptionDefault(details?.name)}
          </Heading>
        </Flex>
        <Text color="text.dark" mt={2} variant="body2">
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
