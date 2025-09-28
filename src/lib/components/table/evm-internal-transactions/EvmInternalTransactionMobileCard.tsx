import type { EvmCallFrame, EvmVerifyInfosResponse } from "lib/services/types";
import type { AssetInfos, Nullable, Option } from "lib/types";

import { Flex, Grid, Stack, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { EvmMethodChip } from "lib/components/EvmMethodChip";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import {
  coinToTokenWithValue,
  formatInteger,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

import { MobileCardTemplate } from "../MobileCardTemplate";
import { MobileLabel } from "../MobileLabel";

interface EvmInternalTransactionMobileCardProps {
  assetInfos: Option<AssetInfos>;
  evmDenom: Option<string>;
  evmVerifyInfos: Option<Nullable<EvmVerifyInfosResponse>>;
  result: EvmCallFrame;
  txHash: string;
}

export const EvmInternalTransactionMobileCard = ({
  assetInfos,
  evmDenom,
  evmVerifyInfos,
  result,
  txHash,
}: EvmInternalTransactionMobileCardProps) => {
  const navigate = useInternalNavigate();
  const token = coinToTokenWithValue(
    evmDenom ?? "",
    result.value?.toString() ?? "0",
    assetInfos
  );

  return (
    <MobileCardTemplate
      bottomContent={
        <Grid gap={3} gridTemplateColumns="1fr 1fr">
          <Flex direction="column" flex={1}>
            <MobileLabel label="Amount" />
            <Text color="text.dark" variant="body2">
              {formatUTokenWithPrecision({
                amount: token.amount,
                precision: token.precision ?? 0,
              })}{" "}
              {getTokenLabel(token.denom, token.symbol)}
            </Text>
          </Flex>
          <Flex direction="column" flex={1}>
            <MobileLabel label="Gas limit" />
            <Text color="text.dark" variant="body2">
              {formatInteger(result.gas.toString())}
            </Text>
          </Flex>
        </Grid>
      }
      middleContent={
        <Stack gap={3}>
          <Stack gap={1}>
            <MobileLabel label="From" />
            <ExplorerLink
              leftIcon={
                <CustomIcon color="primary.main" name="contract-address" />
              }
              showCopyOnHover
              textLabel={evmVerifyInfos?.[result.from]?.contractName}
              type="evm_contract_address"
              value={result.from}
            />
          </Stack>
          <Stack gap={1}>
            <MobileLabel label="To" />
            <ExplorerLink
              leftIcon={
                <CustomIcon color="primary.main" name="contract-address" />
              }
              showCopyOnHover
              textLabel={evmVerifyInfos?.[result.to]?.contractName}
              type="evm_contract_address"
              value={result.to}
            />
          </Stack>
        </Stack>
      }
      topContent={
        <Grid gap={3} gridTemplateColumns="1fr 1fr">
          <Flex direction="column" flex={1}>
            <MobileLabel label="Parent tx hash" />
            <ExplorerLink showCopyOnHover type="tx_hash" value={txHash} />
          </Flex>
          <Flex direction="column" flex={1}>
            <MobileLabel label="Action type" />
            <Flex align="center" gap={1}>
              <CustomIcon
                boxSize={3}
                color="success.main"
                name="check-circle-solid"
              />
              <Text>{result.type.toLowerCase()}</Text>
              <EvmMethodChip
                txInput={result.input}
                txTo={result.to}
                width="auto"
              />
            </Flex>
          </Flex>
        </Grid>
      }
      onClick={() =>
        navigate({
          pathname: "/evm-txs/[txHash]",
          query: { txHash },
        })
      }
    />
  );
};
