import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useClampText } from "use-clamp-text";

import { useInternalNavigate } from "lib/app-provider";
import { UNDEFINED_ICON_LIST } from "lib/data";
import type { PublicProjectInfo } from "lib/types";

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
      ellipsis: "...",
      lines: 3,
      text: item?.description || "",
    });

    return (
      <Flex
        alignItems="center"
        bg="gray.800"
        gap={4}
        height="full"
        minH={48}
        pb={2}
        pt={4}
        px={4}
        _hover={{ bg: "gray.700" }}
        borderRadius="8px"
        cursor="pointer"
        onClick={handleOnClick}
        transition="all 0.25s ease-in-out"
      >
        <Flex
          gap={3}
          height="full"
          w="full"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Flex
              alignItems="flex-start"
              w="full"
              justifyContent="space-between"
            >
              <Flex gap={2} pr={1}>
                <Image
                  width={7}
                  alt="Celatone"
                  height={7}
                  src={item.logo ?? UNDEFINED_ICON_LIST[0]}
                  borderRadius="full"
                />
                <Text
                  mt={1}
                  variant="body1"
                  fontWeight={700}
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {item.name}
                </Text>
              </Flex>
              <BookmarkButton details={item} hasText={false} slug={slug} />
            </Flex>
            <Text
              pt={3}
              variant="body2"
              color="text.dark"
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
