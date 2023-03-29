import { Box, SimpleGrid, Flex, Button, Link, Text } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

import { TextInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { usePublicProjectStore } from "lib/providers/store";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { usePublicProjects } from "lib/services/publicProjectService";
import type { PublicProjectInfo } from "lib/types";

import { PublicProjectCard } from "./PublicProjectCard";

const sortByAtoZ = (projects: PublicProjectInfo[]) =>
  projects.sort((a, b) => a.details.name.localeCompare(b.details.name));

export const AllProject = observer(() => {
  const { data: publicProjectInfo, isLoading } = usePublicProjects();
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

  if (isLoading) return <Loading />;
  if (!publicProjectInfo)
    return (
      <Flex flexDirection="column" alignItems="center">
        <EmptyState
          imageVariant="empty"
          message="We are currently gathering public projects to feature here. If you would like to share your project with the community, please submit your request."
        />
        <Link
          href="https://github.com/alleslabs/celatone-api"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => AmpTrack(AmpEvent.USE_SUBMIT_PROJECT)}
        >
          <Button gap={2} mt={8}>
            <CustomIcon name="github" />
            Submit on Github
          </Button>
        </Link>
      </Flex>
    );

  return (
    <Box minH="xs" w="100%">
      <TextInput
        variant="floating"
        value={searchKeyword}
        setInputState={setSearchKeyword}
        labelBgColor="background"
        placeholder="Search for existing public projects by project name"
        size="md"
        mb={12}
      />
      {!filteredPublicProjects.length ? (
        <EmptyState
          message="None of your lists matches this search."
          imageVariant="not-found"
        />
      ) : (
        <SimpleGrid columns={{ sm: 1, md: 3 }} spacing={4} w="full">
          {filteredPublicProjects.map((item) => (
            <PublicProjectCard
              key={item.slug}
              item={item.details}
              slug={item.slug}
            />
          ))}
        </SimpleGrid>
      )}
      <Flex justifyContent="center" gap="2" w="100%" mt="64px">
        <Text color="text.dark" variant="body2">
          Want your project here?
        </Text>
        <Link
          href="https://github.com/alleslabs/celatone-api"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => AmpTrack(AmpEvent.USE_SUBMIT_PROJECT)}
        >
          Submit on Github
        </Link>
      </Flex>
    </Box>
  );
});
