import { Alert, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { PoolType } from "lib/types";

interface UnderDevAlertProps {
  poolType: PoolType;
}

const poolText = (poolType: PoolType) => {
  if (poolType === PoolType.CL) return "concentrated liquidity";
  if (poolType === PoolType.COSMWASM) return "CosmWasm";
  return "";
};
export const UnderDevAlert = ({ poolType }: UnderDevAlertProps) => (
  <Alert status="info" variant="info">
    <CustomIcon name="alert-circle-solid" boxSize={4} mr={2} />
    <Text color="text.dark">
      Information for pool {poolText(poolType)} is under development
    </Text>
  </Alert>
);
