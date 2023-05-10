import { Box, Text, Flex, Heading, Image } from "@chakra-ui/react";

import { DefualtBreadcrumb } from "lib/components/DefaultBreadcrumb";
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
    <DefualtBreadcrumb
      primaryPage="Public Projects"
      primaryPath="/public-project"
      currentPage={details?.name ?? ""}
    />
    <Flex
      justifyContent="space-between"
      alignItems="flex-start"
      w="full"
      mt={6}
      gap={5}
    >
      <Box>
        <Flex gap={1} align="center" minH="36px">
          {details?.logo && (
            <Image
              src={details?.logo}
              borderRadius="full"
              alt="Celatone"
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
      <Flex alignItems="center" gap={4}>
        <SocialMedia details={details} />
        <BookmarkButton details={details} slug={slug} />
      </Flex>
    </Flex>
  </>
);
