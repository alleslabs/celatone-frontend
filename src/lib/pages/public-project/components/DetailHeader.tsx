import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Flex,
  Heading,
  Link,
  Icon,
  Image,
  Button,
  useToast,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import {
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaDiscord,
  FaInfo,
} from "react-icons/fa";
import {
  MdChevronRight,
  MdBookmark,
  MdBookmarkBorder,
  MdLanguage,
  MdCheckCircle,
} from "react-icons/md";

import { usePublicProjectStore } from "lib/hooks";
import type { Detail } from "lib/services/publicProject";

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

interface DetailProps {
  details: Detail | undefined;
  slug: string;
}
export const DetailHeader = observer(({ details, slug }: DetailProps) => {
  const { isPublicProjectSaved, savePublicProject, removePublicProject } =
    usePublicProjectStore();
  const toast = useToast();
  const handleSave = useCallback(() => {
    savePublicProject({
      name: details?.name || "",
      slug,
      logo: details?.logo || "",
    });

    toast({
      title: `Bookmarked \u2018${details?.name}\u2019 successfully`,
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
  }, [slug, details, savePublicProject, toast]);
  const handleRemove = useCallback(() => {
    removePublicProject(slug);

    toast({
      title: `\u2018${details?.name}\u2019 is removed from bookmark`,
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
  }, [slug, details, removePublicProject, toast]);
  return (
    <Box px="48px">
      <Breadcrumb
        w="full"
        spacing="4px"
        separator={<MdChevronRight color="gray.600" />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/public-project">
            <Text variant="body2" color="text.dark">
              Public Projects
            </Text>
          </BreadcrumbLink>
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
          <Flex alignItems="center" gap="2" mt={2}>
            {details?.website && (
              <Link href={details?.website} target="_blank">
                <Icon
                  as={MdLanguage}
                  color="gray.600"
                  _hover={{ color: "gray.500" }}
                  transition="all 0.2s"
                  boxSize="6"
                />
              </Link>
            )}
            {details?.github && (
              <Link href={details?.github} target="_blank">
                <Icon
                  as={FaGithub}
                  color="gray.600"
                  _hover={{ color: "gray.500" }}
                  transition="all 0.2s"
                  boxSize="6"
                />
              </Link>
            )}
            {details?.socials.length &&
              details?.socials.map((social) => (
                <Flex>
                  {social.url !== "" && (
                    <Link href={social.url} target="_blank">
                      <Icon
                        as={renderSocial(social.name)}
                        color="gray.600"
                        _hover={{ color: "gray.500" }}
                        transition="all 0.2s"
                        boxSize="6"
                      />
                    </Link>
                  )}
                </Flex>
              ))}
          </Flex>
          {/* TODO: add/remove from bookmark */}
          {isPublicProjectSaved(slug) ? (
            <Button
              variant="outline-primary"
              gap={2}
              onClick={() => handleRemove()}
            >
              <Icon as={MdBookmark} boxSize="4" color="primary.main" />
              Bookmarked
            </Button>
          ) : (
            <Button
              variant="outline"
              gap={2}
              onClick={() => {
                if (details) {
                  handleSave();
                }
              }}
            >
              <Icon as={MdBookmarkBorder} boxSize="4" color="gray.600" />
              Bookmark Project
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
});
