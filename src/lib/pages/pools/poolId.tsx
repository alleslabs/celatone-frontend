import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { usePoolConfig, useTierConfig } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";

import {
  PoolAssets,
  PoolRelatedTxs,
  PoolTopSection,
} from "./components/pool-details";
import { useDerivedPoolData } from "./data";
import { zPoolDetailsQueryParams } from "./types";

const InvalidPool = () => <InvalidState title="Pool does not exist" />;

const PoolIdBody = ({ poolId }: { poolId: number }) => {
  const router = useRouter();
  const { pool, isLoading } = useDerivedPoolData(poolId);

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_POOL_DETAILS);
  }, [router.isReady]);

  if (isLoading) return <Loading />;
  if (pool === undefined) return <ErrorFetching dataName="pool information" />;
  if (pool === null) return <InvalidPool />;

  return (
    <>
      <CelatoneSeo pageName={pool.id ? `Pool #${pool.id}` : "Pool details"} />
      <PoolTopSection pool={pool} />
      <PoolAssets pool={pool} />
      <PoolRelatedTxs pool={pool} />
      <UserDocsLink
        title="What is Osmosis liquidity pools?"
        cta="Read more about Osmosis Pool Details"
        href="osmosis/pool-detail"
      />
    </>
  );
};

const PoolId = () => {
  useTierConfig({ minTier: "full" });
  usePoolConfig({ shouldRedirect: true });
  const router = useRouter();
  const validated = zPoolDetailsQueryParams.safeParse(router.query);

  return (
    <PageContainer>
      {validated.success ? <PoolIdBody {...validated.data} /> : <InvalidPool />}
    </PageContainer>
  );
};

export default PoolId;
