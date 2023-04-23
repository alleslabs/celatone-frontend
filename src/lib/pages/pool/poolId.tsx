import { useRouter } from "next/router";

import { useInternalNavigate } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";

import { MockUpPoolList } from "./components/constant";
import { PoolAssetDetail } from "./components/PoolAssetDetail";
import { PoolDetailHeader } from "./components/PoolDetailHeader";
import { PoolRelatedTxs } from "./components/PoolRelatedTxs";

export const PoolId = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();

  if (!router.query.poolId) return <Loading />;
  const poolIdParam = router.query.poolId;
  const pool = MockUpPoolList.find((x) => x.id === +poolIdParam);
  if (!pool) return navigate({ pathname: `/pool` });
  return (
    <PageContainer>
      <PoolDetailHeader pool={pool} />
      <PoolAssetDetail
        assets={pool.poolLiquidity}
        pool_type={pool.type}
        // weight={pool.weight}
        // scaling_factors={pool.scaling_factors}
      />
      <PoolRelatedTxs poolId={Number(poolIdParam)} />
    </PageContainer>
  );
};
