import { Flex } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useMobile, useMoveConfig, useTierConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import { CelatoneSeo } from "lib/components/Seo";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { ModuleVerificationButton } from "./components/ModuleVerificationButton";
import { RecentModulesTable } from "./components/RecentModulesTable";

const RecentModules = () => {
  useTierConfig({ minTier: "full" });
  useMoveConfig({ shouldRedirect: true });
  const router = useRouter();
  const isMobile = useMobile();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_MODULES);
  }, [router.isReady]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Modules" />
      <Flex alignItems="center" gap={4} w="full">
        <PageHeader
          docHref="move/modules/detail-page"
          subtitle=" These modules are the most recently published on this network"
          title="Modules"
        />
        {!isMobile && <ModuleVerificationButton />}
      </Flex>
      <RecentModulesTable />
    </PageContainer>
  );
};

export default RecentModules;
