import { Box, SimpleGrid, Flex, Button, Icon } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";
import { BsGithub } from "react-icons/bs";
import { MdOutlineManageSearch } from "react-icons/md";

import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import { usePublicProjectStore } from "lib/hooks";
import { usePublicProjectsQuery } from "lib/services/publicProject";

import { PublicProjectCard } from "./PublicProjectCard";

export const AllProject = () => {
  const { data: publicProjectInfo } = usePublicProjectsQuery();
  const [searchKeyword, setSearchKeyword] = useState("");
  const { getPublicProjects } = usePublicProjectStore();

  const filteredPublicProjects = useMemo(() => {
    if (publicProjectInfo) {
      const savedProjects = getPublicProjects();
      // HACKED
      // TODO Sort saved project
      const orderedProjects = publicProjectInfo.map((project) => {
        const foundIndex = savedProjects.findIndex(
          (each) => each.slug === project.slug
        );

        return {
          ...project,
          order: foundIndex === -1 ? 9999 : foundIndex,
        };
      });

      return matchSorter(orderedProjects, searchKeyword, {
        keys: ["details.name"],
      });
    }
    return [];
  }, [getPublicProjects, publicProjectInfo, searchKeyword]);

  if (!publicProjectInfo)
    return (
      <Flex flexDirection="column" alignItems="center">
        <EmptyState
          icon={MdOutlineManageSearch}
          message="We are currently gathering public projects to feature here. If you would like to share your project with the community, please submit your request."
        />
        <Button gap={2} mt={8}>
          <Icon as={BsGithub} />
          Submit on Github
        </Button>
      </Flex>
    );

  return (
    <Box minH="xs" w="100%">
      <TextInput
        variant="floating"
        value={searchKeyword}
        setInputState={setSearchKeyword}
        label="Search for existing public projects"
        size="md"
        mb={12}
      />
      {!filteredPublicProjects.length ? (
        <EmptyState message="None of your lists matches this search." />
      ) : (
        <SimpleGrid columns={{ sm: 1, md: 3, xl: 4 }} spacing={4} w="full">
          {filteredPublicProjects.map((item) => (
            <PublicProjectCard
              key={item.slug}
              item={item.details}
              slug={item.slug}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
