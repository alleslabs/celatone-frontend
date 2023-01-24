import { Box, SimpleGrid, Flex, Button, Icon } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { BsGithub } from "react-icons/bs";
import { MdOutlineManageSearch, MdSearchOff } from "react-icons/md";

import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import { usePublicProjectStore } from "lib/hooks";
import { usePublicProjectsQuery } from "lib/services/publicProject";
import type { PublicProjectInfo } from "lib/types";

import { PublicProjectCard } from "./PublicProjectCard";

const sortByAtoZ = (projects: PublicProjectInfo[]) =>
  projects.sort((a, b) => a.details.name.localeCompare(b.details.name));

export const AllProject = observer(() => {
  const { data: publicProjectInfo } = usePublicProjectsQuery();
  const [searchKeyword, setSearchKeyword] = useState("");
  const { getSavedPublicProjects } = usePublicProjectStore();
  const savedProjects = getSavedPublicProjects();

  const filteredPublicProjects = useMemo(() => {
    if (publicProjectInfo) {
      const orderedProjects = sortByAtoZ(publicProjectInfo);
      const orderSavedProjects = sortByAtoZ(
        publicProjectInfo.filter((project) =>
          savedProjects.some((save) => save.slug === project.slug)
        )
      );

      const order = new Set([...orderSavedProjects, ...orderedProjects]);

      return matchSorter([...Array.from(order)], searchKeyword, {
        keys: ["details.name"],
        sorter: (rankedItems) => rankedItems,
        threshold: matchSorter.rankings.CONTAINS,
      });
    }
    return [];
  }, [publicProjectInfo, savedProjects, searchKeyword]);

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
        <EmptyState
          message="None of your lists matches this search."
          icon={MdSearchOff}
        />
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
});
