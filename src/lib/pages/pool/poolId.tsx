// import { Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useInternalNavigate } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";

import { MockUpPoolList } from "./components/constant";
import { PoolAssetDetail } from "./components/PoolAssetDetail";
import { PoolDetailHeader } from "./components/PoolDetailHeader";

export const PoolId = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();

  if (!router.query.poolId) return <Loading />;
  const query = router.query.poolId;
  const pool = MockUpPoolList.find((x) => x.pool_id === +query);
  if (!pool) return navigate({ pathname: `/pool` });
  return (
    <PageContainer>
      <PoolDetailHeader pool={pool} />
      <PoolAssetDetail assets={pool.pool_liquidity} />
    </PageContainer>
  );
};
