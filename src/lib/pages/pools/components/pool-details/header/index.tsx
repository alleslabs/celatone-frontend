import { Button, Flex } from "@chakra-ui/react";

import { PoolHeader } from "../../PoolHeader";
import { trackUseViewJSON, trackWebsite } from "lib/amplitude";
import { useBaseApiRoute, usePoolConfig } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomIcon } from "lib/components/icon";
import type { PoolData } from "lib/types";
import { openNewTab } from "lib/utils";

import { PoolInfo } from "./PoolInfo";

interface PoolTopSectionProps {
  pool: PoolData;
}

export const PoolTopSection = ({ pool }: PoolTopSectionProps) => {
  const poolConfig = usePoolConfig({ shouldRedirect: true });
  // Remark: the empty string has never been used when poolConfig is disabled
  const poolUrl = poolConfig.enabled ? poolConfig.url : "";

  const lcdEndpoint = useBaseApiRoute("rest");
  const openPoolLcd = () => {
    trackUseViewJSON("pool_page_pool_lcd");
    openNewTab(`${lcdEndpoint}/osmosis/poolmanager/v1beta1/pools/${pool.id}`);
  };
  const openOsmosisPool = () => {
    trackWebsite(`${poolUrl}/${pool.id}`);
    openNewTab(`${poolUrl}/${pool.id}`);
  };
  return (
    <>
      <Breadcrumb
        items={[
          { href: "/pools", text: "Pools" },
          { text: `#${pool.id.toString()}` },
        ]}
      />
      <Flex align="center" mt={4} w="full" justifyContent="space-between">
        <PoolHeader
          isSuperfluid={pool.isSuperfluid}
          liquidity={pool.liquidity}
          poolId={pool.id}
          poolType={pool.type}
        />
        <Flex align="center" gap={2}>
          <Button
            variant="ghost-gray"
            onClick={openPoolLcd}
            rightIcon={
              <CustomIcon name="launch" boxSize={3} color="gray.400" />
            }
          >
            View in JSON
          </Button>
          <Button
            variant="outline-primary"
            onClick={openOsmosisPool}
            rightIcon={
              <CustomIcon name="launch" boxSize={3} color="primary.light" />
            }
          >
            View in Osmosis
          </Button>
        </Flex>
      </Flex>
      <PoolInfo pool={pool} />
    </>
  );
};
