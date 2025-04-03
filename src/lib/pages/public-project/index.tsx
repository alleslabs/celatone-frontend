import { Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { usePublicProjectConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";

import { AllProject } from "./components/AllProject";

export const AllPublicProjectsPage = () => {
  const router = useRouter();

  usePublicProjectConfig({ shouldRedirect: true });
  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_ALL_PROJECTS);
  }, [router.isReady]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Public projects" />
      <Flex direction="column" alignItems="center" gap={8}>
        <Flex justifyContent="space-between" w="full" alignItems="center">
          <Heading
            as="h5"
            variant="h5"
            minH="36px"
            display="flex"
            alignItems="center"
          >
            Public projects
          </Heading>
        </Flex>
        <AllProject />
      </Flex>
    </PageContainer>
  );
};
