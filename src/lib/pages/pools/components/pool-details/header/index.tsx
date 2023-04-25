import { Button, Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type Big from "big.js";

import { getPoolUrl } from "lib/app-fns/explorer";
import { useLCDEndpoint } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { openNewTab } from "lib/hooks";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { PoolDetail, TokenWithValue } from "lib/types";

import { PoolHeader } from "./PoolHeader";
import { PoolInfo } from "./PoolInfo";

interface PoolTopSectionProps {
  pool: PoolDetail<Big, TokenWithValue>;
  assetInfos: AssetInfosOpt;
}

export const PoolTopSection = ({ pool, assetInfos }: PoolTopSectionProps) => {
  const { currentChainName } = useWallet();
  const lcdEndpoint = useLCDEndpoint();

  const openPoolLcd = () =>
    openNewTab(`${lcdEndpoint}/osmosis/gamm/v1beta1/pools/${pool.id}`);
  const openOsmosisPool = () =>
    openNewTab(`${getPoolUrl(currentChainName)}/${pool.id}`);
  return (
    <>
      <Flex justifyContent="space-between" align="center" w="full">
        <PoolHeader pool={pool} assetInfos={assetInfos} />
        <Flex align="center" gap={2}>
          <Button
            variant="ghost-gray"
            rightIcon={
              <CustomIcon name="launch" boxSize={3} color="pebble.400" />
            }
            onClick={openPoolLcd}
          >
            View in JSON
          </Button>
          <Button
            variant="outline-primary"
            rightIcon={
              <CustomIcon name="launch" boxSize={3} color="violet.light" />
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
