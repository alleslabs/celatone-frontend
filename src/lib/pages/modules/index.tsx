import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useInitiaL1,
  useMobile,
  useMoveConfig,
  useTierConfig,
} from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import { CelatoneSeo } from "lib/components/Seo";

import { ModuleVerificationButton } from "./components/ModuleVerificationButton";
import { RecentModulesTable } from "./components/RecentModulesTable";

const RecentModules = () => {
  useTierConfig({ minTier: "full" });
  useMoveConfig({ shouldRedirect: true });
  const router = useRouter();
  const isMobile = useMobile();
  const isInitiaL1 = useInitiaL1({ shouldRedirect: false });

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_MODULES);
  }, [router.isReady]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Modules" />
      <Flex alignItems="center" w="full" gap={4}>
        <PageHeader
          title="Modules"
          subtitle=" These modules are the most recently published on this network"
          docHref="move/modules/detail-page"
        />
        {!isMobile && isInitiaL1 && <ModuleVerificationButton />}
      </Flex>
      <RecentModulesTable />
    </PageContainer>
  );
};

export default RecentModules;
