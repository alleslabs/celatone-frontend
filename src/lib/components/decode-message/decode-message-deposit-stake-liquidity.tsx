import type { DecodedMessage } from "@initia/tx-decoder";

import { Flex, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useAssetInfos } from "lib/services/assetService";
import { zValidatorAddr } from "lib/types";
import { coinToTokenWithValue } from "lib/utils";
import { useState } from "react";

import type { TxMsgData } from "../tx-message";

<<<<<<< HEAD
import { DexPoolLink } from "../DexPoolLink";
=======
>>>>>>> d88a05a2e (feat(components): support decode message lp deposit and stake)
import { ExplorerLink } from "../ExplorerLink";
import { TokenImageWithAmount } from "../token";
import { CoinsComponent } from "../tx-message/msg-receipts/CoinsComponent";
import { ValidatorBadge } from "../ValidatorBadge";
import { DecodeMessageBody } from "./decode-message-body";
<<<<<<< HEAD
import { DecodeMessageExecute } from "./decode-message-execute";
=======
>>>>>>> d88a05a2e (feat(components): support decode message lp deposit and stake)
import { DecodeMessageHeader } from "./decode-message-header";
import { DecodeMessageRow } from "./decode-message-row";

interface DecodeMessageDepositStakeLiquidityProps extends TxMsgData {
  decodedMessage: DecodedMessage & {
    action: "deposit_stake_liquidity";
  };
}

export const DecodeMessageDepositStakeLiquidity = ({
  compact,
  decodedMessage,
  log,
  msgBody,
  msgCount,
}: DecodeMessageDepositStakeLiquidityProps) => {
  const isSingleMsg = msgCount === 1;
  const [expand, setExpand] = useState(!!isSingleMsg);
  const { data, isIbc, isOp } = decodedMessage;

  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const tokenA = coinToTokenWithValue(data.denomA, data.amountA, assetInfos);
  const coinA = new Coin(data.denomA, data.amountA);
  const tokenB = coinToTokenWithValue(data.denomB, data.amountB, assetInfos);
  const coinB = new Coin(data.denomB, data.amountB);

  return (
    <Flex direction="column" maxW="inherit">
      <DecodeMessageHeader
        compact={compact}
        gap={2}
<<<<<<< HEAD
=======
        iconName="delegate"
>>>>>>> d88a05a2e (feat(components): support decode message lp deposit and stake)
        isExpand={expand}
        isIbc={isIbc}
        isOpinit={isOp}
        isSingleMsg={!!isSingleMsg}
<<<<<<< HEAD
        label="Provide & Stake"
=======
        label="LP Deposit & Stake"
>>>>>>> d88a05a2e (feat(components): support decode message lp deposit and stake)
        msgCount={msgCount}
        type={msgBody["@type"]}
        onClick={() => setExpand(!expand)}
      >
        <TokenImageWithAmount token={tokenA} />
        <Text color="text.dark">+</Text>
        <TokenImageWithAmount token={tokenB} />
        <Text color="text.dark">to</Text>
<<<<<<< HEAD
        <DexPoolLink liquidityDenom={data.liquidityDenom} />
=======
        {/* TODO: add LP token */}
>>>>>>> d88a05a2e (feat(components): support decode message lp deposit and stake)
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
<<<<<<< HEAD
        <DecodeMessageRow title="Address">
=======
        <DecodeMessageRow title="Staker">
>>>>>>> d88a05a2e (feat(components): support decode message lp deposit and stake)
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
<<<<<<< HEAD
          <DexPoolLink liquidityDenom={data.liquidityDenom} />
=======
          -{/* TODO: add LP token */}
>>>>>>> d88a05a2e (feat(components): support decode message lp deposit and stake)
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
<<<<<<< HEAD
        <DecodeMessageExecute log={log} msgBody={msgBody} />
=======
>>>>>>> d88a05a2e (feat(components): support decode message lp deposit and stake)
      </DecodeMessageBody>
    </Flex>
  );
};
