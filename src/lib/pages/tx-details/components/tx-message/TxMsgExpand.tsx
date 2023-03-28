import { Badge, Flex } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { findAttribute } from "@cosmjs/stargate/build/logs";
import type { ReactNode } from "react";

import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import type { Addr } from "lib/types";
import type { VoteOption } from "lib/utils";
import { formatBalanceWithDenom, voteOption } from "lib/utils";

import type { TxMsgData } from ".";

interface TxMsgExpandProps extends TxMsgData {
  isExpand: boolean;
  onClick: () => void;
}

export const TxMsgExpand = ({
  msgBody,
  log,
  isExpand,
  assetInfos,
  onClick,
}: TxMsgExpandProps) => {
  const getAddressType = useGetAddressType();
  let msgIcon: IconKeys = "info-circle";
  let content: ReactNode;
  const isIBC = Boolean(
    log?.events?.find((event) => event.type === "send_packet")
  );
  const { "@type": type, ...body } = msgBody;

  switch (type) {
    case "/cosmwasm.wasm.v1.MsgStoreCode":
      msgIcon = "upload";
      content = (
        <>
          Upload Wasm
          {log && (
            <>
              {" "}
              and stored as
              <ExplorerLink
                type="code_id"
                value={findAttribute([log], "store_code", "code_id").value}
                showCopyOnHover
                fontSize="24px"
                textVariant="body1"
              />
            </>
          )}
        </>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract":
      msgIcon = "instantiate";
      content = (
        <>
          Instantiate
          {log && (
            <ExplorerLink
              type="contract_address"
              value={
                findAttribute([log], "instantiate", "_contract_address").value
              }
              showCopyOnHover
              textVariant="body1"
            />
          )}
          <p>from</p>
          <ExplorerLink
            type="code_id"
            value={body.code_id}
            showCopyOnHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract2":
      msgIcon = "instantiate";
      content = (
        <>
          Instantiate2
          {log && (
            <ExplorerLink
              type="contract_address"
              value={
                findAttribute([log], "instantiate", "_contract_address").value
              }
              showCopyOnHover
              textVariant="body1"
            />
          )}
          <p>from</p>
          <ExplorerLink
            type="code_id"
            value={body.code_id}
            showCopyOnHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgExecuteContract":
      msgIcon = "execute";
      content = (
        <>
          Execute
          <span style={{ fontWeight: 700 }}>{Object.keys(body.msg).at(0)}</span>
          on
          <ExplorerLink
            type="contract_address"
            value={body.contract}
            showCopyOnHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgMigrateContract":
      msgIcon = "migrate";
      content = (
        <>
          Migrate{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract}
            showCopyOnHover
            textVariant="body1"
          />{" "}
          to Code ID{" "}
          <ExplorerLink
            type="code_id"
            value={body.code_id}
            showCopyOnHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgUpdateAdmin":
      msgIcon = "admin-edit";
      content = (
        <>
          Update admin on{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract}
            showCopyOnHover
            textVariant="body1"
          />{" "}
          to{" "}
          <ExplorerLink
            type={getAddressType(body.new_admin)}
            value={body.new_admin}
            showCopyOnHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgClearAdmin":
      msgIcon = "admin-clear";
      content = (
        <>
          Clear admin on{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract}
            showCopyOnHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmos.bank.v1beta1.MsgSend":
      {
        const toAddress = body.to_address as Addr;
        const singleCoin = body.amount.at(0) as Coin;
        const assetInfo = assetInfos?.[singleCoin.denom];
        const assetText =
          body.amount.length > 1
            ? "assets"
            : formatBalanceWithDenom({
                coin: singleCoin,
                symbol: assetInfo?.symbol,
                precision: assetInfo?.precision,
              });
        msgIcon = "send";
        content = (
          <>
            Send {assetText} to
            <ExplorerLink
              type={getAddressType(toAddress)}
              value={toAddress}
              showCopyOnHover
              textVariant="body1"
            />
          </>
        );
      }
      break;
    case "/cosmos.gov.v1beta1.MsgSubmitProposal":
      msgIcon = "submit-proposal";
      content = (
        <>
          Submit Proposal
          {log && (
            <>
              <p>ID</p>
              <ExplorerLink
                type="proposal_id"
                value={
                  findAttribute([log], "submit_proposal", "proposal_id").value
                }
                showCopyOnHover
                textVariant="body1"
              />
            </>
          )}
        </>
      );
      break;
    case "/cosmos.gov.v1beta1.MsgVote":
      msgIcon = "vote";
      content = (
        <>
          Vote{" "}
          <span style={{ fontWeight: 700 }}>
            {voteOption[body.option as VoteOption]}
          </span>{" "}
          on proposal ID{" "}
          <ExplorerLink
            type="proposal_id"
            value={body.proposal_id}
            showCopyOnHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmos.staking.v1beta1.MsgDelegate":
      msgIcon = "delegate";
      content = (
        <>
          Delegate by{" "}
          <ExplorerLink
            type={getAddressType(body.delegator_address)}
            value={body.delegator_address}
            showCopyOnHover
            textVariant="body1"
          />{" "}
          to{" "}
          <ExplorerLink
            type={getAddressType(body.validator_address)}
            value={body.validator_address}
            showCopyOnHover
            textVariant="body1"
          />
        </>
      );
      break;
    default: {
      const msgType = type.split(".");
      content = msgType[msgType.length - 1];
      break;
    }
  }

  return (
    <Flex
      position="relative"
      p="16px 8px"
      align="center"
      justify="space-between"
      borderRadius="8px"
      transition="all .25s ease-in-out"
      cursor="pointer"
      onClick={onClick}
      _hover={{ backgroundColor: "pebble.800" }}
      _after={{
        content: '""',
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        h: "1px",
        w: "99%",
        bg: "pebble.700",
      }}
    >
      <Flex align="center" gap={2} fontSize="16px" fontWeight={500}>
        <CustomIcon name={msgIcon} boxSize={4} color="lilac.main" m={0} />
        {content}
        {isIBC && <Badge variant="honeydew">IBC</Badge>}
      </Flex>
      <CustomIcon
        name="chevron-down"
        color="pebble.600"
        boxSize={4}
        transform={isExpand ? "rotate(180deg)" : "rotate(0)"}
        transition="all .25s ease-in-out"
        m={0}
      />
    </Flex>
  );
};
