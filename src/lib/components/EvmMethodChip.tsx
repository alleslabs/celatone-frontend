import type { TagProps } from "@chakra-ui/react";
import type { HexAddr20, Nullable } from "lib/types";

import { Tag } from "@chakra-ui/react";
import { useEvmVerifyInfos } from "lib/services/verification/evm";
import { getEvmMethod, getEvmMethodName } from "lib/utils";
import { useMemo } from "react";

interface EvmMethodChipProps {
  txInput: string;
  txTo: Nullable<HexAddr20>;
  width?: TagProps["width"];
}

export const EvmMethodChip = ({
  txInput,
  txTo,
  width = "144px",
}: EvmMethodChipProps) => {
  const { data: evmVerifyInfos } = useEvmVerifyInfos(txTo ? [txTo] : []);
  const evmVerifyInfo = txTo ? evmVerifyInfos?.[txTo.toLowerCase()] : undefined;

  const methodName = useMemo(() => {
    if (evmVerifyInfo?.abi) {
      const decodedName = getEvmMethodName(evmVerifyInfo.abi, txInput);
      if (decodedName) return decodedName;
    }
    return getEvmMethod(txInput, txTo);
  }, [evmVerifyInfo?.abi, txInput, txTo]);

  return (
    <Tag justifyContent="center" variant="gray" width={width}>
      {methodName}
    </Tag>
  );
};
