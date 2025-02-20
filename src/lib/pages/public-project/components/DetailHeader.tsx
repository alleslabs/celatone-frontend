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
        { text: "Public Projects", href: "/projects" },
        { text: details?.name },
      ]}
    />
    <Flex
      justifyContent="space-between"
      alignItems="flex-start"
      w="full"
      mt={6}
      gap={5}
      direction={{ base: "column", md: "row" }}
    >
      <Box>
        <Flex gap={1} align="center" minH="36px">
          {details?.logo && (
            <Image
              src={details?.logo}
              borderRadius="full"
              alt="Scan"
              width={7}
              height={7}
            />
          )}
          <Heading as="h5" variant="h5" className="ellipsis">
            {getNameAndDescriptionDefault(details?.name)}
          </Heading>
        </Flex>
        <Text variant="body2" color="text.dark" mt={2}>
          {getNameAndDescriptionDefault(details?.description)}
        </Text>
      </Box>
      <Flex
        alignItems="center"
        justify="space-between"
        gap={4}
        w={{ base: "full", md: "auto" }}
      >
        <SocialMedia details={details} />
        <BookmarkButton details={details} slug={slug} />
      </Flex>
    </Flex>
  </>
);
