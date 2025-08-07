import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useAssetInfos } from "lib/services/assetService";
import { zValidatorAddr } from "lib/types";
import {
  coinToTokenWithValue,
  dateDiffDuration,
  formatDayJSDuration,
  formatUTC,
  parseUnixToDate,
} from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { DexPoolLink } from "../DexPoolLink";
import { ExplorerLink } from "../ExplorerLink";
import { TokenImageWithAmount } from "../token";
import { CoinsComponent } from "../tx-message/msg-receipts/CoinsComponent";
import { ValidatorBadge } from "../ValidatorBadge";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageExtendLiquidityProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "extend_liquidity";
  };
}

export const DecodeMessageExtendLiquidity = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageExtendLiquidityProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;
  const { data: assetInfos } = useAssetInfos({ withPrices: false });

  const lpToken = coinToTokenWithValue(
    data.liquidityDenom,
    data.liquidity,
    assetInfos
  );
  const lpCoin = new Coin(data.liquidityDenom, data.liquidity);

  const initialReleaseTimestamp = parseUnixToDate(data.initialReleaseTimestamp);
  const newReleaseTimestamp = parseUnixToDate(data.newReleaseTimestamp);
  const extendedPeriod = dateDiffDuration(
    newReleaseTimestamp,
    initialReleaseTimestamp
  );

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="Extend"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <TokenImageWithAmount token={lpToken} />
        <Text color="text.dark">for</Text>
        <Text>{formatDayJSDuration(extendedPeriod)}</Text>
        <Text color="text.dark">via</Text>
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
          <CoinsComponent coins={[lpCoin]} />
        </DecodeMessageRow>
        <DecodeMessageRow title="Extended period">
          <Text>{formatDayJSDuration(extendedPeriod)}</Text>
        </DecodeMessageRow>
        {newReleaseTimestamp && (
          <DecodeMessageRow title="Release timestamp">
            {formatUTC(newReleaseTimestamp)}
          </DecodeMessageRow>
        )}
      </DecodeMessageBody>
    </Flex>
  );
};
