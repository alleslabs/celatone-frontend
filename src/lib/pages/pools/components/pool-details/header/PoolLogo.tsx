import { Flex, Image } from "@chakra-ui/react";
import type Big from "big.js";

import { getUndefinedTokenIcon } from "../../../utils";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { TokenWithValue } from "lib/types";
import type { PoolDetail } from "lib/types/pool";

interface PoolLogoProps {
  poolLiquidity: PoolDetail<Big, TokenWithValue>["poolLiquidity"];
  assetInfos: AssetInfosOpt;
}

export const PoolLogo = ({ poolLiquidity, assetInfos }: PoolLogoProps) => {
  return (
    <Flex
      css={{
        "> img:not(:first-of-type), > div": {
          marginLeft: "-12px",
        },
      }}
      width="96px"
      alignItems="center"
      justifyContent="center"
    >
      {poolLiquidity.length > 3 ? (
        <>
          {poolLiquidity.slice(0, 2).map((asset, i) => (
            <Image
              key={`${asset.denom}-logo`}
              boxSize={10}
              src={
                assetInfos?.[asset.denom]?.logo ??
                getUndefinedTokenIcon(asset.denom)
              }
              zIndex={2 - i}
            />
          ))}
          <Flex
            width={10}
            height={10}
            borderRadius="full"
            backgroundColor="pebble.700"
            alignItems="center"
            justifyContent="center"
          >
            +{poolLiquidity.length - 2}
          </Flex>
        </>
      ) : (
        poolLiquidity.map((item, i) => (
          <Image
            key={`${item.denom}-logo`}
            boxSize={10}
            src={
              assetInfos?.[item.denom]?.logo ??
              getUndefinedTokenIcon(item.denom)
            }
            zIndex={2 - i}
          />
        ))
      )}
    </Flex>
  );
};
