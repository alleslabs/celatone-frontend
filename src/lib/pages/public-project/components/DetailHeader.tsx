import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  Flex,
  Heading,
  Icon,
  Image,
  Button,
  useToast,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import {
  MdChevronRight,
  MdBookmark,
  MdBookmarkBorder,
  MdCheckCircle,
} from "react-icons/md";

import { usePublicProjectStore } from "lib/hooks";
import type { Detail } from "lib/services/publicProject";
import type { Option } from "lib/types";

import { SocialMedia } from "./SocialMedia";

interface DetailProps {
  details: Option<Detail>;
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
    <Box px={12}>
      <Breadcrumb
        w="full"
        spacing={1}
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
          <SocialMedia details={details} />
          {isPublicProjectSaved(slug) ? (
            <Button
              variant="outline-primary"
              gap={2}
              onClick={() => handleRemove()}
            >
              <Icon as={MdBookmark} boxSize={4} color="primary.main" />
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
              <Icon as={MdBookmarkBorder} boxSize={4} color="gray.600" />
              Bookmark Project
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
});
