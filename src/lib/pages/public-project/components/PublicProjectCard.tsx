import { Flex, Icon, Text, Image, useToast } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import {
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaDiscord,
  FaInfo,
} from "react-icons/fa";
import {
  MdBookmark,
  MdBookmarkBorder,
  MdLanguage,
  MdCheckCircle,
} from "react-icons/md";

import { usePublicProjectStore } from "lib/hooks";
import type { PublicProjectInfo } from "lib/services/publicProject";

interface PublicProjectCardProps {
  item: PublicProjectInfo["details"];
  slug: string;
}

export const renderSocial = (name: string) => {
  switch (name) {
    case "twitter":
      return FaTwitter;
    case "telegram":
      return FaTelegram;
    case "discord":
      return FaDiscord;
    default:
      return FaInfo;
  }
};

export const PublicProjectCard = observer(
  ({ item, slug }: PublicProjectCardProps) => {
    const router = useRouter();
    const toast = useToast();
    const handleOnClick = () => {
      router.push({ pathname: `/public-project/${slug}` });
    };

    const { isPublicProjectSaved, savePublicProject, removePublicProject } =
      usePublicProjectStore();
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
            {/* TODO: if save -> change to this icon */}
            {/* <Icon as={MdBookmark} color="primary.main" boxSize="6" /> */}
          </Flex>
          <Text variant="body3" color="text.dark">
            {item?.description}
          </Text>
          <Flex
            alignItems="center"
            gap="2"
            mt="2"
            zIndex={1}
            onClick={(e) => e.stopPropagation()}
          >
            {item?.website && (
              <Link href={item?.website} target="_blank">
                <Icon
                  as={MdLanguage}
                  color="gray.600"
                  _hover={{ color: "gray.500" }}
                  transition="all 0.2s"
                  boxSize="6"
                />
              </Link>
            )}
            {item?.github && (
              <Link href={item?.github} target="_blank">
                <Icon
                  as={FaGithub}
                  color="gray.600"
                  _hover={{ color: "gray.500" }}
                  transition="all 0.2s"
                  boxSize="5"
                />
              </Link>
            )}
            {item?.socials.length &&
              item.socials.map((social) => (
                <Flex key={social.name}>
                  {social.url !== "" && (
                    <Link href={social.url} target="_blank">
                      <Icon
                        as={renderSocial(social.name)}
                        color="gray.600"
                        _hover={{ color: "gray.500" }}
                        transition="all 0.2s"
                        boxSize="5"
                      />
                    </Link>
                  )}
                </Flex>
              ))}
          </Flex>
        </Flex>
      </Flex>
    );
  }
);
