import { Flex, Icon, Text, Image, useToast, Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { MdBookmark, MdBookmarkBorder, MdCheckCircle } from "react-icons/md";
import { useClampText } from "use-clamp-text";

import { usePublicProjectStore } from "lib/hooks";
import type { PublicProjectInfo } from "lib/services/publicProject";

import { SocialMedia } from "./SocialMedia";

interface PublicProjectCardProps {
  item: PublicProjectInfo["details"];
  slug: string;
}

export const PublicProjectCard = observer(
  ({ item, slug }: PublicProjectCardProps) => {
    const router = useRouter();
    const toast = useToast();
    const handleOnClick = () => {
      router.push({ pathname: `/public-project/${slug}` });
    };

    const { isPublicProjectSaved, savePublicProject, removePublicProject } =
      usePublicProjectStore();
    const [ref, { clampedText }] = useClampText({
      text: item?.description || "",
      ellipsis: "...",
      lines: 3,
    });
    // TODO combine to 1 component that share with bookmark button in slug
    const handleSave = useCallback(() => {
      savePublicProject({
        name: item.name,
        slug,
        logo: item.logo,
      });

      toast({
        title: `Bookmarked \u2018${item.name}\u2019 successfully`,
        status: "success",
        duration: 5000,
        isClosable: false,
        position: "bottom-right",
        icon: (
          <Icon
            as={MdCheckCircle}
            color="success.main"
            boxSize="6"
            display="flex"
            alignItems="center"
          />
        ),
      });
    }, [slug, item, savePublicProject, toast]);
    const handleRemove = useCallback(() => {
      removePublicProject(slug);

      toast({
        title: `\u2018${item.name}\u2019 is removed from bookmark`,
        status: "success",
        duration: 5000,
        isClosable: false,
        position: "bottom-right",
        icon: (
          <Icon
            as={MdCheckCircle}
            color="success.main"
            boxSize="6"
            display="flex"
            alignItems="center"
          />
        ),
      });
    }, [slug, item, removePublicProject, toast]);
    return (
      <Flex
        px="4"
        pt="4"
        pb="2"
        alignItems="center"
        bg="gray.900"
        _hover={{ bg: "gray.800" }}
        transition="all 0.2s"
        borderRadius="4"
        gap={4}
        height="full"
        onClick={handleOnClick}
        cursor="pointer"
      >
        <Flex
          flexDirection="column"
          gap={3}
          w="full"
          height="full"
          justifyContent="space-between"
        >
          <Box>
            <Flex justifyContent="space-between" w="full">
              <Flex gap={2}>
                <Image
                  src={item.logo}
                  borderRadius="full"
                  alt="Celatone"
                  width={7}
                  height={7}
                />
                <Text
                  variant="body1"
                  fontWeight="600"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  mt="3px"
                >
                  {item.name}
                </Text>
              </Flex>
              {isPublicProjectSaved(slug) ? (
                <Icon
                  as={MdBookmark}
                  color="primary.main"
                  boxSize="6"
                  cursor="pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                />
              ) : (
                <Icon
                  as={MdBookmarkBorder}
                  color="gray.600"
                  boxSize="6"
                  cursor="pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}
                />
              )}
            </Flex>
            <Text
              ref={ref as React.MutableRefObject<HTMLParagraphElement>}
              variant="body3"
              color="text.primary"
              pt={3}
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
