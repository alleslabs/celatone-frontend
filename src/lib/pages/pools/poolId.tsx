import { useRouter } from "next/router";

import { useInternalNavigate } from "lib/app-provider";
import { BackButton } from "lib/components/button";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
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
