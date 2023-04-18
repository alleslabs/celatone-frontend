import { useRouter } from "next/router";

import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state";
import type { Option, PoolDetail } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

import { PoolAssetDetail } from "./components/PoolAssetDetail";
import { PoolDetailHeader } from "./components/PoolDetailHeader";
import { PoolRelatedTxs } from "./components/PoolRelatedTxs";
import { usePool } from "./data";

interface PoolIdBodyProps {
  pool: Option<PoolDetail>;
  isLoading: boolean;
}
const PoolIdBody = ({ pool, isLoading }: PoolIdBodyProps) => {
  if (isLoading) return <Loading />;
  if (!pool)
    return <EmptyState message="Pool Not Found." imageVariant="not-found" />;
  return (
    <>
      <PoolDetailHeader pool={pool} />
      <PoolAssetDetail
        assets={pool.poolLiquidity}
        pool_type={pool.type}
        // weight={pool.weight}
        // scaling_factors={pool.scaling_factors}
      />
      <PoolRelatedTxs />
    </>
  );
};

export const PoolId = () => {
  const router = useRouter();
  const poolIdParam = getFirstQueryParam(router.query.poolId);

  const { pool, isLoading } = usePool(Number(poolIdParam));
  return (
    <PageContainer>
      <PoolIdBody pool={pool} isLoading={isLoading} />
    </PageContainer>
  );
};
