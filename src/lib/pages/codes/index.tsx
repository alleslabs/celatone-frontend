import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useTierConfig, useWasmConfig } from "lib/app-provider";
import PageContainer from "lib/components/PageContainer";
import { PageHeader } from "lib/components/PageHeader";

import { RecentCodesTableFull } from "./components/RecentCodesTableFull";
import { RecentCodesTableLite } from "./components/RecentCodesTableLite";

const RecentCodes = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const tier = useTierConfig();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_CODES);
  }, [router.isReady]);

  return (
    <PageContainer>
      <PageHeader
        title="Codes"
        subtitle="This page displays all codes on this network sorted by recency"
        docHref="introduction/overview#recent-codes"
      />
      {tier === "lite" ? <RecentCodesTableLite /> : <RecentCodesTableFull />}
    </PageContainer>
  );
});

export default RecentCodes;
