import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Loading } from "lib/components/Loading";
import { EmptyState, StateImage } from "lib/components/state";
import { usePublicProjectStore } from "lib/providers/store";
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

  if (isLoading) return <Loading withBorder />;
  if (!publicProjectInfo)
    return (
      <Flex
        flexDirection="column"
        alignItems="center"
        w="full"
        bg="gray.900"
        borderRadius={8}
        p={12}
      >
        <StateImage imageVariant="empty" />
        <Heading as="h6" variant="h6" mt={2} textAlign="center">
          Gathering Public Projects...
        </Heading>
        <Text
          mt={4}
          mb={8}
          color="text.dark"
          textAlign="center"
          whiteSpace="pre-wrap"
          variant="body2"
        >
          We are currently gathering public projects to feature here.
          <br /> To share yours with the community, please submit your request.
        </Text>
        <Link
          href="https://github.com/alleslabs/celatone-api"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(AmpEvent.USE_SUBMIT_PROJECT)}
        >
          <Button gap={2} variant="outline-primary">
            <CustomIcon name="github" />
            Submit on Github
          </Button>
        </Link>
      </Flex>
    );

  return (
    <Box minH="xs" w="100%">
      <InputWithIcon
        placeholder="Search with project name"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        size={{ base: "md", md: "lg" }}
        my={2}
        amptrackSection="public-project-search"
      />
      {!filteredPublicProjects.length ? (
        <EmptyState
          message="No matching projects found.
        Make sure you are searching with Project Name."
          imageVariant="not-found"
          withBorder
        />
      ) : (
        <SimpleGrid
          columns={{ sm: 1, md: 3 }}
          mt={{ base: 6, md: 12 }}
          spacing={4}
          w="full"
        >
          {filteredPublicProjects.map((item) => (
            <PublicProjectCard
              key={item.slug}
              item={item.details}
              slug={item.slug}
            />
          ))}
        </SimpleGrid>
      )}
      <Flex
        justifyContent="center"
        gap={2}
        w="100%"
        mt={{ base: 8, md: 16 }}
        mb={{ base: 4, md: 0 }}
      >
        <Text color="text.dark" variant="body2">
          Want your project here?
        </Text>
        <Link
          href="https://github.com/alleslabs/celatone-api"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(AmpEvent.USE_SUBMIT_PROJECT)}
        >
          Submit on Github
        </Link>
      </Flex>
    </Box>
  );
});
