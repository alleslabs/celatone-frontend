import type { PoolData } from "lib/types";

import { Button, Flex } from "@chakra-ui/react";
import { trackUseViewJSON, trackWebsite } from "lib/amplitude";
import { useBaseApiRoute, usePoolConfig } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomIcon } from "lib/components/icon";
import { openNewTab } from "lib/utils";

import { PoolHeader } from "../../PoolHeader";
import { PoolInfo } from "./PoolInfo";

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
      <Flex align="center" justifyContent="space-between" mt={4} w="full">
        <PoolHeader
          isSuperfluid={pool.isSuperfluid}
          liquidity={pool.liquidity}
          poolId={pool.id}
          poolType={pool.type}
        />
        <Flex align="center" gap={2}>
          <Button
            rightIcon={
              <CustomIcon boxSize={3} color="gray.400" name="launch" />
            }
            variant="ghost-gray"
            onClick={openPoolRest}
          >
            View in JSON
          </Button>
          <Button
            rightIcon={
              <CustomIcon boxSize={3} color="primary.light" name="launch" />
            }
            variant="outline-primary"
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
