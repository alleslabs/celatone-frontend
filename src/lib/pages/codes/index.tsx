import { AmpEvent, track } from "lib/amplitude";
import { useWasmConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";
import { CelatoneSeo } from "lib/components/Seo";
import { TierSwitcher } from "lib/components/TierSwitcher";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { RecentCodesTableFull } from "./components/RecentCodesTableFull";
import { RecentCodesTableLite } from "./components/RecentCodesTableLite";

const RecentCodes = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_CODES);
  }, [router.isReady]);

  return (
    <PageContainer>
      <CelatoneSeo pageName="Codes" />
      <PageHeader
        docHref="introduction/overview#recent-codes"
        subtitle="This page displays all codes on this network sorted by recency"
        title="Codes"
      />
      <TierSwitcher
        full={<RecentCodesTableFull />}
        lite={<RecentCodesTableLite />}
      />
    </PageContainer>
  );
});

export default RecentCodes;
