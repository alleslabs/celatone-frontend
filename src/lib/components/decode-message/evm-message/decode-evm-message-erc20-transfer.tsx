import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedErc20TransferCall } from "@initia/tx-decoder";
import type { EvmVerifyInfosResponse } from "lib/services/types";
import type { Nullable, Option } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { TokenImageWithAmount } from "lib/components/token/TokenImageWithAmount";
import { CoinsComponent } from "lib/components/tx-message/msg-receipts/CoinsComponent";
import { useAssetInfos } from "lib/services/assetService";
import { coinToTokenWithValue } from "lib/utils";

import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeEvmMessageErc20TransferProps {
  compact: boolean;
  decodedTransaction: DecodedErc20TransferCall;
  evmVerifyInfos: Option<Nullable<EvmVerifyInfosResponse>>;
  log: Option<Log>;
  msgCount: number;
}

export const DecodeEvmMessageErc20TransferHeader = ({
  compact,
  decodedTransaction,
  evmVerifyInfos,
  msgCount,
}: DecodeEvmMessageErc20TransferProps) => {
  const { amount, denom, from, to } = decodedTransaction.data;
  const { data: assetInfos } = useAssetInfos({ withPrices: false });

  const token = coinToTokenWithValue(denom, amount, assetInfos);

  return (
    <Flex direction="column" w="100%">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand
        isIbc={false}
        isOpinit={false}
        isSingleMsg={msgCount === 1}
        label="ERC20 transfer"
        msgCount={msgCount}
        type={decodedTransaction.action}
      >
        <Flex align="center" flexWrap="nowrap" gap={2} minWidth="fit-content">
          <TokenImageWithAmount token={token} />
        </Flex>
        <Text color="text.dark">from</Text>
        <ExplorerLink
          showCopyOnHover
          textLabel={evmVerifyInfos?.[from.toLowerCase()]?.contractName}
          textVariant={compact ? "body2" : "body1"}
          type="user_address"
          value={from}
        />
        <Text color="text.dark">to</Text>
        <ExplorerLink
          showCopyOnHover
          textLabel={evmVerifyInfos?.[to.toLowerCase()]?.contractName}
          textVariant={compact ? "body2" : "body1"}
          type="user_address"
          value={to}
        />
      </DecodeMessageHeader>
    </Flex>
  );
};

export const DecodeEvmMessageErc20TransferBody = ({
  compact,
  decodedTransaction,
  evmVerifyInfos,
}: DecodeEvmMessageErc20TransferProps) => {
  const { amount, contract, denom, from, to } = decodedTransaction.data;

  return (
    <DecodeMessageBody
      compact={compact}
      isExpand
      log={undefined}
      sx={{
        pl: 0,
      }}
    >
      <DecodeMessageRow title="Sender">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="user_address"
          value={from}
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Receiver">
        <ExplorerLink
          showCopyOnHover
          textFormat="normal"
          type="user_address"
          value={to}
        />
      </DecodeMessageRow>
      <DecodeMessageRow title="Amount">
        <CoinsComponent coins={[{ amount, denom }]} />
      </DecodeMessageRow>
      <DecodeMessageRow title="ERC-20 Contract">
        <ExplorerLink
          leftIcon={
            <CustomIcon
              boxSize={4}
              color="primary.main"
              name="contract-address"
            />
          }
          showCopyOnHover
          textFormat="normal"
          textLabel={evmVerifyInfos?.[contract.toLowerCase()]?.contractName}
          type="user_address"
          value={contract}
        />
      </DecodeMessageRow>
    </DecodeMessageBody>
  );
};
