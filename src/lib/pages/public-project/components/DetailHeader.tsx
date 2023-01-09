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
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
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

  return (
    <Box px="48px">
      <Breadcrumb
        w="full"
        spacing="4px"
        separator={<MdChevronRight color="gray.600" />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink color="text.dark" href="/public-project">
            Public Projects
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">
            <Text
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
        alignItems="center"
        w="full"
        mt={2}
        gap={5}
      >
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
              onClick={() => removePublicProject(slug)}
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
                  savePublicProject({
                    name: details.name,
                    slug,
                    logo: details.logo,
                  });
                }
              }}
            >
              <Icon as={MdBookmarkBorder} boxSize="4" color="gray.600" />
              Bookmark Project
            </Button>
          )}
        </Flex>
      </Flex>
      <Text variant="body3" color="text.dark" mt={2}>
        {details?.description}
      </Text>
    </Box>
  );
});
