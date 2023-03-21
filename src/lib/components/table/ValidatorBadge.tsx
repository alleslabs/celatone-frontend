import { Flex, Image } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { ExplorerLink } from "../ExplorerLink";
import type { ValidatorInfo } from "lib/types";

const validatorMap: Record<string, string> = {
  osmosis:
    "https://raw.githubusercontent.com/cosmostation/chainlist/master/chain/osmosis/moniker",
  terra2:
    "https://raw.githubusercontent.com/cosmostation/chainlist/master/chain/terra/moniker",
};

interface ValidatorBadgeProps {
  validator: ValidatorInfo;
}

export const ValidatorBadge = ({ validator }: ValidatorBadgeProps) => {
  const { currentChainName } = useWallet();

  return (
    <Flex alignItems="center" gap={2}>
      <Image
        boxSize={10}
        src={`${validatorMap[currentChainName]}/${validator.validatorAddress}.png`}
        alt={validator.moniker}
        fallbackSrc={`https://ui-avatars.com/api/?name=${
          validator.moniker ?? ""
        }&background=9793F3&color=fff`}
        borderRadius="50%"
      />
      <ExplorerLink
        value={validator.moniker ?? validator.validatorAddress}
        copyValue={validator.validatorAddress}
        type="validator_address"
        textFormat="ellipsis"
        showCopyOnHover
      />
    </Flex>
  );
};
