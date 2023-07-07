import { useRouter } from "next/router";
import { useEffect } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { BackButton } from "lib/components/button";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { getFirstQueryParam } from "lib/utils";

import {
  PoolTopSection,
  PoolAssets,
  PoolRelatedTxs,
} from "./components/pool-details";
import { usePool } from "./data";

export const PoolId = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const poolId = Number(getFirstQueryParam(router.query.poolId));
  const { pool, isLoading } = usePool(poolId);

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_POOL_DETAIL);
  }, [router.isReady]);

  if (isLoading) return <Loading />;
  if (!pool) return navigate({ pathname: `/pools` });
  return (
    <PageContainer>
      <BackButton />
      <PoolTopSection pool={pool} />
      <PoolAssets pool={pool} />
      <PoolRelatedTxs pool={pool} />
    </PageContainer>
  );
};
