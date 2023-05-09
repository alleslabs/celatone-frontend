import { useRouter } from "next/router";

import { useInternalNavigate } from "lib/app-provider";
import { BackButton } from "lib/components/button";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { useAssetInfos } from "lib/services/assetService";
import { getFirstQueryParam } from "lib/utils";

import { PoolTopSection } from "./components/pool-details/header";
import { PoolAssets } from "./components/pool-details/pool-assets";
import { PoolRelatedTxs } from "./components/pool-details/table/PoolRelatedTxs";
import { usePool } from "./data";

export const PoolId = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { assetInfos } = useAssetInfos();
  const poolId = Number(getFirstQueryParam(router.query.poolId));
  const { pool, isLoading } = usePool(poolId);

  if (isLoading) return <Loading />;
  if (!pool) return navigate({ pathname: `/pool` });
  return (
    <PageContainer>
      <BackButton />
      <PoolTopSection pool={pool} assetInfos={assetInfos} />
      <PoolAssets pool={pool} />
      <PoolRelatedTxs />
    </PageContainer>
  );
};
