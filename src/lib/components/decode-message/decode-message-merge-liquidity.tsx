import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { zValidatorAddr } from "lib/types";
import { formatUTC, parseUnixToDate } from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

import { DexPoolLink } from "../DexPoolLink";
import { ExplorerLink } from "../ExplorerLink";
import { MergedPositions } from "../MergedPositions";
import { CoinsComponent } from "../tx-message/msg-receipts/CoinsComponent";
import { ValidatorBadge } from "../ValidatorBadge";
import { DecodeMessageBody } from "./decode-message-body";
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageMergeLiquidityProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "merge_liquidity";
  };
}

export const DecodeMessageMergeLiquidity = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageMergeLiquidityProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;

  const coin = new Coin(data.liquidityDenom, data.mergedLiquidity);
  const releaseTimestamp = parseUnixToDate(data.newReleaseTimestamp);

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
        label="Merge"
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <DexPoolLink liquidityDenom={data.liquidityDenom} />
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
        <DecodeMessageRow title="Merged Positions">
          <MergedPositions
            initialPositions={data.initialPositions}
            liquidityDenom={data.liquidityDenom}
          />
        </DecodeMessageRow>
        <DecodeMessageRow title="Merged Assets">
          <CoinsComponent coins={[coin]} />
        </DecodeMessageRow>
        {releaseTimestamp && (
          <DecodeMessageRow title="Release timestamp">
            {formatUTC(releaseTimestamp)}
          </DecodeMessageRow>
        )}
      </DecodeMessageBody>
    </Flex>
  );
};
