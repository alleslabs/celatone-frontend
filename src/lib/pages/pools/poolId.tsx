import { useRouter } from "next/router";
import { useEffect } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { BackButton } from "lib/components/button";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { PoolType } from "lib/types";
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
    // First version, navigate to contract details page if pool type is CosmWasm
    if (pool?.type === PoolType.COSMWASM)
      navigate({
        pathname: `/contracts/${pool.contractAddress}`,
        replace: true,
      });
  }, [navigate, pool, pool?.contractAddress, pool?.type, router.isReady]);

  if (isLoading) return <Loading />;
  if (!pool) return navigate({ pathname: `/pool` });
  return (
    <PageContainer>
      <BackButton />
      <PoolTopSection pool={pool} />
      <PoolAssets pool={pool} />
      <PoolRelatedTxs pool={pool} />
    </PageContainer>
  );
};
