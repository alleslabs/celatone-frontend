import type { PublicProjectInfo } from "lib/types";

import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { UNDEFINED_ICON_LIST } from "lib/data";
import { observer } from "mobx-react-lite";
import { useClampText } from "use-clamp-text";

import { BookmarkButton } from "./BookmarkButton";
import { SocialMedia } from "./SocialMedia";

interface PublicProjectCardProps {
  item: PublicProjectInfo["details"];
  slug: string;
}

export const PublicProjectCard = observer(
  ({ item, slug }: PublicProjectCardProps) => {
    const navigate = useInternalNavigate();
    const handleOnClick = () => {
      navigate({ pathname: `/projects/[slug]`, query: { slug } });
    };

    const [ref, { clampedText }] = useClampText({
      text: item?.description || "",
      ellipsis: "...",
      lines: 3,
    });

    return (
      <Flex
        _hover={{ bg: "gray.700" }}
        alignItems="center"
        bg="gray.800"
        borderRadius="8px"
        cursor="pointer"
        gap={4}
        height="full"
        minH={48}
        pb={2}
        pt={4}
        px={4}
        transition="all 0.25s ease-in-out"
        onClick={handleOnClick}
      >
        <Flex
          flexDirection="column"
          gap={3}
          height="full"
          justifyContent="space-between"
          w="full"
        >
          <Box>
            <Flex
              alignItems="flex-start"
              justifyContent="space-between"
              w="full"
            >
              <Flex gap={2} pr={1}>
                <Image
                  alt="Scan"
                  borderRadius="full"
                  height={7}
                  src={item.logo ?? UNDEFINED_ICON_LIST[0]}
                  width={7}
                />
                <Text
                  fontWeight={700}
                  mt={1}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  variant="body1"
                >
                  {item.name}
                </Text>
              </Flex>
              <BookmarkButton details={item} hasText={false} slug={slug} />
            </Flex>
            <Text
              color="text.dark"
              pt={3}
              variant="body2"
              ref={ref as React.MutableRefObject<HTMLParagraphElement>}
            >
              {clampedText}
            </Text>
          </Box>
          <SocialMedia details={item} />
        </Flex>
      </Flex>
    );
  }
);
