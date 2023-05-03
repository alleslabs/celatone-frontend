import type { Coin } from "@cosmjs/stargate";
import { ParameterChangeProposal } from "cosmjs-types/cosmos/params/v1beta1/params";

import { microfy } from "../formatter";
import { typeUrlDict } from "lib/data";
import { MsgType } from "lib/types";
import type { ComposedMsg, TxMessage, Addr, Token } from "lib/types";

export const composeMsg = (msgType: MsgType, msg: TxMessage): ComposedMsg => {
  const typeUrl = typeUrlDict[msgType];
  return {
    typeUrl,
    value: msg,
  };
};

interface WhitelistProposalMsgArgs {
  title: string;
  description: string;
  changesValue: string;
  initialDeposit: Coin;
  proposer: Addr;
}

export const composeSubmitWhitelistProposalMsg = ({
  title,
  description,
  changesValue,
  initialDeposit,
  proposer,
}: WhitelistProposalMsgArgs): ComposedMsg =>
  composeMsg(MsgType.SUBMIT_PROPOSAL, {
    content: {
      typeUrl: "/cosmos.params.v1beta1.ParameterChangeProposal",
      value: Uint8Array.from(
        ParameterChangeProposal.encode({
          title,
          description,
          changes: [
            {
              subspace: "wasm",
              key: "uploadAccess",
              value: changesValue,
            },
          ],
        }).finish()
      ),
    },
    initialDeposit: [
      {
        ...initialDeposit,
        amount: microfy((initialDeposit.amount || 0) as Token).toFixed(0),
      },
    ],
    proposer,
  });
