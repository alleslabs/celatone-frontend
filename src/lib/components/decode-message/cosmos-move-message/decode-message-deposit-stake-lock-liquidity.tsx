import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useAssetInfos } from "lib/services/assetService";
import { zValidatorAddr } from "lib/types";
import {
  coinToTokenWithValue,
  formatDayJSDuration,
  formatUTC,
  parseSecondsToDuration,
  parseUnixToDate,
} from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../../tx-message";

import { DexPoolLink } from "../../DexPoolLink";
import { ExplorerLink } from "../../ExplorerLink";
import { TokenImageWithAmount } from "../../token";
import { CoinsComponent } from "../../tx-message/msg-receipts/CoinsComponent";
import { ValidatorBadge } from "../../ValidatorBadge";
import { DecodeMessageBody } from "../decode-message-body";
import { DecodeMessageExecute } from "../decode-message-execute";
import { DecodeMessageHeader } from "../decode-message-header";
import { DecodeMessageRow } from "../decode-message-row";

interface DecodeMessageDepositStakeLockLiquidityProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "deposit_stake_lock_liquidity";
  };
}

export const DecodeMessageDepositStakeLockLiquidity = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageDepositStakeLockLiquidityProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;

  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const tokenA = coinToTokenWithValue(data.denomA, data.amountA, assetInfos);
  const coinA = new Coin(data.denomA, data.amountA);
  const tokenB = coinToTokenWithValue(data.denomB, data.amountB, assetInfos);
  const coinB = new Coin(data.denomB, data.amountB);

  const releaseTimestamp = parseUnixToDate(data.releaseTimestamp);

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="Provide & Stake"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <TokenImageWithAmount token={tokenA} />
        <Text color="text.dark">+</Text>
        <TokenImageWithAmount token={tokenB} />
        <Text color="text.dark">to</Text>
        <DexPoolLink liquidityDenom={data.liquidityDenom} />
        <Text color="text.dark">via</Text>
        <ValidatorBadge
          badgeSize={4}
          fixedHeight={compact}
          hasLabel={false}
          sx={{
            width: "fit-content",
          }}
          textFormat={!compact ? "normal" : "ellipsis"}
          validator={{
            identity: data.validator?.description.identity,
            moniker: data.validator?.description.moniker,
            validatorAddress: zValidatorAddr.parse(data.validatorAddress),
          }}
        />
      </DecodeMessageHeader>
      <DecodeMessageBody compact={compact} isExpand={expand} log={log}>
        <DecodeMessageRow title="Address">
          <ExplorerLink
            maxWidth="full"
            showCopyOnHover
            textFormat="normal"
            type="user_address"
            value={data.from}
            wordBreak="break-word"
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Pool">
          <DexPoolLink liquidityDenom={data.liquidityDenom} />
        </DecodeMessageRow>
        <DecodeMessageRow title="Validator">
          <ValidatorBadge
            badgeSize={4}
            sx={{
              width: "fit-content",
            }}
            validator={{
              identity: data.validator?.description.identity,
              moniker: data.validator?.description.moniker,
              validatorAddress: zValidatorAddr.parse(data.validatorAddress),
            }}
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Assets">
          <CoinsComponent coins={[coinA, coinB]} />
        </DecodeMessageRow>
        <DecodeMessageRow title="Lock period">
          {formatDayJSDuration(parseSecondsToDuration(data.lockTime))}
        </DecodeMessageRow>
        <DecodeMessageRow title="Release timestamp">
          {formatUTC(releaseTimestamp)}
        </DecodeMessageRow>
        <DecodeMessageExecute log={log} msgBody={msgBody} />
      </DecodeMessageBody>
    </Flex>
  );
};
