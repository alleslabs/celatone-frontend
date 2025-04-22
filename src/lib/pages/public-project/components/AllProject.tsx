import type { PublicProjectInfo } from "lib/types";

import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import InputWithIcon from "lib/components/InputWithIcon";
import { Loading } from "lib/components/Loading";
import { EmptyState, StateImage } from "lib/components/state";
import { usePublicProjectStore } from "lib/providers/store";
import { usePublicProjects } from "lib/services/publicProjectService";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

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

      const order = new Set([...orderedProjects, ...orderSavedProjects]);

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
        alignItems="center"
        bg="gray.900"
        borderRadius={8}
        flexDirection="column"
        p={12}
        w="full"
      >
        <StateImage imageVariant="empty" />
        <Heading as="h6" mt={2} textAlign="center" variant="h6">
          Gathering Public Projects...
        </Heading>
        <Text
          color="text.dark"
          mb={8}
          mt={4}
          textAlign="center"
          variant="body2"
          whiteSpace="pre-wrap"
        >
          We are currently gathering public projects to feature here.
          <br /> To share yours with the community, please submit your request.
        </Text>
        <Link
          href="https://github.com/alleslabs/celatone-api"
          rel="noopener noreferrer"
          target="_blank"
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
        amptrackSection="public-project-search"
        my={2}
        placeholder="Search with project name"
        size={{ base: "md", md: "lg" }}
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      {!filteredPublicProjects.length ? (
        <EmptyState
          imageVariant="not-found"
          message="No matching projects found.
        Make sure you are searching with Project Name."
          withBorder
        />
      ) : (
        <SimpleGrid
          columns={{ md: 3, sm: 1 }}
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
        gap={2}
        justifyContent="center"
        mb={{ base: 4, md: 0 }}
        mt={{ base: 8, md: 16 }}
        w="100%"
      >
        <Text color="text.dark" variant="body2">
          Want your project here?
        </Text>
        <Link
          href="https://github.com/alleslabs/celatone-api"
          rel="noopener noreferrer"
          target="_blank"
          onClick={() => track(AmpEvent.USE_SUBMIT_PROJECT)}
        >
          Submit on Github
        </Link>
      </Flex>
    </Box>
  );
});
