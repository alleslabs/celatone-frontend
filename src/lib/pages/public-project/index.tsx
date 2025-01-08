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
      <CelatoneSeo pageName="Public Projects" />
      <Flex alignItems="center" gap={8} direction="column">
        <Flex alignItems="center" w="full" justifyContent="space-between">
          <Heading
            alignItems="center"
            as="h5"
            display="flex"
            minH="36px"
            variant="h5"
          >
            Public Projects
          </Heading>
        </Flex>
        <AllProject />
      </Flex>
    </PageContainer>
  );
};
