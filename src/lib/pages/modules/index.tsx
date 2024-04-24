import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useMoveConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import PageHeaderContainer from "lib/components/PageHeaderContainer";

import { RecentModulesTable } from "./components/RecentModulesTable";

const RecentModules = () => {
  useMoveConfig({ shouldRedirect: true });
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_MODULES);
  }, [router.isReady]);

  return (
    <>
      <PageHeaderContainer bgColor="overlay.module">
        <PageHeader
          title="Modules"
          subtitle=" These modules are the most recently published on this network"
          docHref="move/modules/detail-page"
        />
      </PageHeaderContainer>
      <PageContainer>
        <RecentModulesTable />
      </PageContainer>
    </>
  );
};

export default RecentModules;
