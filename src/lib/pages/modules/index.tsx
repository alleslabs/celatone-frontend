import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";

import { RecentModulesTable } from "./components/RecentModulesTable";

const RecentModules = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_MODULES);
  }, [router.isReady]);

  return (
    <PageContainer>
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
