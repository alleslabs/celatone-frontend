import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useMoveConfig, useTierConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import { CelatoneSeo } from "lib/components/Seo";

import { RecentModulesTable } from "./components/RecentModulesTable";

const RecentModules = () => {
  useTierConfig({ minTier: "full" });
  useMoveConfig({ shouldRedirect: true });
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_MODULES);
  }, [router.isReady]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Modules" />
      <PageHeader
        title="Modules"
        subtitle=" These modules are the most recently published on this network"
        docHref="move/modules/detail-page"
      />
      <RecentModulesTable />
    </PageContainer>
  );
};

export default RecentModules;
