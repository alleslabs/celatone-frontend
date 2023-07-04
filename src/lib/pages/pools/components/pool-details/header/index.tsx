import { Button, Flex } from "@chakra-ui/react";
import { useMemo } from "react";

import { PoolHeader } from "../../PoolHeader";
import { useBaseApiRoute, usePoolConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { AmpTrackViewJson, AmpTrackWebsite } from "lib/services/amplitude";
import type { PoolDetail } from "lib/types";
import { openNewTab } from "lib/utils";

import { PoolInfo } from "./PoolInfo";

interface PoolTopSectionProps {
  pool: PoolDetail;
}

export const PoolTopSection = ({ pool }: PoolTopSectionProps) => {
  const poolConfig = usePoolConfig({ shouldRedirect: true });
  const poolUrl = useMemo(() => {
    if (!poolConfig.enabled) return "";
    return poolConfig.url;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolConfig.enabled]);

  const lcdEndpoint = useBaseApiRoute("rest");
  const openPoolLcd = () => {
    AmpTrackViewJson("pool_page_pool_lcd");
    openNewTab(`${lcdEndpoint}/osmosis/gamm/v1beta1/pools/${pool.id}`);
  };
  const openOsmosisPool = () => {
    AmpTrackWebsite(`${poolUrl}/${pool.id}`);
    openNewTab(`${poolUrl}/${pool.id}`);
  };
  return (
    <>
      <Flex justifyContent="space-between" align="center" w="full">
        <PoolHeader
          poolId={pool.id}
          isSuperfluid={pool.isSuperfluid}
          poolType={pool.type}
          poolLiquidity={pool.poolLiquidity}
        />
        <Flex align="center" gap={2}>
          <Button
            variant="ghost-gray"
            rightIcon={
              <CustomIcon name="launch" boxSize={3} color="gray.400" />
            }
            onClick={openPoolLcd}
          >
            View in JSON
          </Button>
          <Button
            variant="outline-primary"
            rightIcon={
              <CustomIcon name="launch" boxSize={3} color="primary.light" />
            }
            onClick={openOsmosisPool}
          >
            View in Osmosis
          </Button>
        </Flex>
      </Flex>
      <PoolInfo pool={pool} />
    </>
  );
};
