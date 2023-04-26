import { Flex, Image } from "@chakra-ui/react";

import { getUndefinedTokenIcon } from "../utils";
import type { PoolDetail } from "lib/types/pool";

interface PoolLogoProps {
  poolLiquidity: PoolDetail["poolLiquidity"];
}
export const PoolLogo = ({ poolLiquidity }: PoolLogoProps) => {
  return (
    <Flex
      css={{
        ">:not(:first-of-type)": {
          marginLeft: "-12px",
        },
      }}
      width="96px"
      alignItems="center"
      justifyContent="center"
    >
      {poolLiquidity.length > 3 ? (
        <>
          {poolLiquidity.slice(0, 2).map((item, i) => (
            <Image
              key={item.denom}
              boxSize={10}
              src={item.logo ?? getUndefinedTokenIcon(item.denom)}
              zIndex={2 - i}
            />
          ))}
          <Flex
            minW={10}
            minH={10}
            borderRadius="full"
            backgroundColor="pebble.700"
            alignItems="center"
            justifyContent="center"
            marginLeft="-12px"
          >
            +{poolLiquidity.length - 2}
          </Flex>
        </>
      ) : (
        poolLiquidity.map((asset, i) => (
          <Image
            key={asset.denom}
            boxSize={10}
            src={asset.logo ?? getUndefinedTokenIcon(asset.denom)}
            zIndex={2 - i}
          />
        ))
      )}
    </Flex>
  );
};
