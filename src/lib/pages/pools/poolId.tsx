import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useInternalNavigate,
  usePoolConfig,
  useTierConfig,
} from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { EmptyState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";

import {
  PoolAssets,
  PoolRelatedTxs,
  PoolTopSection,
} from "./components/pool-details";
import { usePool } from "./data";
import { zPoolDetailsQueryParams } from "./types";

const PoolIdBody = ({ poolId }: { poolId: number }) => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { pool, isLoading } = usePool(poolId);

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_POOL_DETAILS);
  }, [router.isReady]);

  if (isLoading) return <Loading />;
  if (!pool) {
    navigate({ pathname: `/pools` });
    return null;
  }

  return (
    <>
      <CelatoneSeo pageName={pool.id ? `Pool #${pool.id}` : "Pool Details"} />
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

export const PoolId = () => {
  useTierConfig({ minTier: "full" });
  usePoolConfig({ shouldRedirect: true });
  const router = useRouter();
  const validated = zPoolDetailsQueryParams.safeParse(router.query);

  return (
    <PageContainer>
      {validated.success ? (
        <PoolIdBody {...validated.data} />
      ) : (
        <EmptyState
          imageVariant="not-found"
          heading="Pool does not exist"
          message="Please check your input or make sure you have selected the correct network."
        />
      )}
    </PageContainer>
  );
};
