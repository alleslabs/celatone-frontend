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
        p={12}
        w="full"
        borderRadius={8}
        flexDirection="column"
      >
        <StateImage imageVariant="empty" />
        <Heading as="h6" mt={2} textAlign="center" variant="h6">
          Gathering Public Projects...
        </Heading>
        <Text
          mb={8}
          mt={4}
          textAlign="center"
          variant="body2"
          whiteSpace="pre-wrap"
          color="text.dark"
        >
          We are currently gathering public projects to feature here.
          <br /> To share yours with the community, please submit your request.
        </Text>
        <Link
          rel="noopener noreferrer"
          target="_blank"
          onClick={() => track(AmpEvent.USE_SUBMIT_PROJECT)}
          href="https://github.com/alleslabs/celatone-api"
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
        my={2}
        size={{ base: "md", md: "lg" }}
        value={searchKeyword}
        amptrackSection="public-project-search"
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="Search with Project Name"
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
          mt={{ base: 6, md: 12 }}
          spacing={4}
          w="full"
          columns={{ md: 3, sm: 1 }}
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
        mb={{ base: 4, md: 0 }}
        mt={{ base: 8, md: 16 }}
        w="100%"
        justifyContent="center"
      >
        <Text variant="body2" color="text.dark">
          Want your project here?
        </Text>
        <Link
          rel="noopener noreferrer"
          target="_blank"
          onClick={() => track(AmpEvent.USE_SUBMIT_PROJECT)}
          href="https://github.com/alleslabs/celatone-api"
        >
          Submit on Github
        </Link>
      </Flex>
    </Box>
  );
});
