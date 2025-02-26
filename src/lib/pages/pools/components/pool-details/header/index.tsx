import { Button, Flex } from "@chakra-ui/react";

import { trackUseViewJSON, trackWebsite } from "lib/amplitude";
import { useBaseApiRoute, usePoolConfig } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomIcon } from "lib/components/icon";
import type { PoolData } from "lib/types";
import { openNewTab } from "lib/utils";

import { PoolInfo } from "./PoolInfo";
import { PoolHeader } from "../../PoolHeader";

interface PoolTopSectionProps {
  pool: PoolData;
}

export const PoolTopSection = ({ pool }: PoolTopSectionProps) => {
  const poolConfig = usePoolConfig({ shouldRedirect: true });
  // Remark: the empty string has never been used when poolConfig is disabled
  const poolUrl = poolConfig.enabled ? poolConfig.url : "";

  const restEndpoint = useBaseApiRoute("rest");
  const openPoolRest = () => {
    trackUseViewJSON("pool_page_pool_rest");
    openNewTab(`${restEndpoint}/osmosis/poolmanager/v1beta1/pools/${pool.id}`);
  };
  const openOsmosisPool = () => {
    trackWebsite(`${poolUrl}/${pool.id}`);
    openNewTab(`${poolUrl}/${pool.id}`);
  };
  return (
    <>
      <Breadcrumb
        items={[
          { text: "Pools", href: "/pools" },
          { text: `#${pool.id.toString()}` },
        ]}
      />
      <Flex justifyContent="space-between" align="center" w="full" mt={4}>
        <PoolHeader
          poolId={pool.id}
          isSuperfluid={pool.isSuperfluid}
          poolType={pool.type}
          liquidity={pool.liquidity}
        />
        <Flex align="center" gap={2}>
          <Button
            variant="ghost-gray"
            rightIcon={
              <CustomIcon name="launch" boxSize={3} color="gray.400" />
            }
            onClick={openPoolRest}
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
