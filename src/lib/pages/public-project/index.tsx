import { Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useInternalNavigate, useWasmConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { AllProject } from "./components/AllProject";

export const AllPublicProjectsPage = () => {
  useWasmConfig({ shouldRedirect: true });
  const navigate = useInternalNavigate();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_ALL_PROJECTS);
  }, [navigate, router.isReady]);

  return (
    <PageContainer>
      <Flex direction="column" alignItems="center" gap={8}>
        <Flex justifyContent="space-between" w="full" alignItems="center">
          <Heading as="h5" variant="h5">
            Public Projects
          </Heading>
        </Flex>
        <AllProject />
      </Flex>
    </PageContainer>
  );
};
