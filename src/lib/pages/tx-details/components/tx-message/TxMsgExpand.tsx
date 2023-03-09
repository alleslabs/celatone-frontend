import { Badge, Flex, Icon } from "@chakra-ui/react";
import { findAttribute } from "@cosmjs/stargate/build/logs";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { FiChevronDown } from "react-icons/fi";
import {
  MdInfo,
  MdUpload,
  MdAdd,
  MdMessage,
  MdSend,
  MdMail,
  MdOutlineHowToVote,
  MdDonutLarge,
  MdFormatIndentIncrease,
  MdPersonRemove,
  MdManageAccounts,
} from "react-icons/md";

import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Addr } from "lib/types";

import type { TxMsgData } from ".";
import { voteOption } from "./msg-receipts/mapping";

interface TxMsgExpandProps extends TxMsgData {
  isExpand: boolean;
  onClick: () => void;
}

export const TxMsgExpand = ({
  msgBody,
  log,
  isExpand,
  onClick,
}: TxMsgExpandProps) => {
  const getAddressType = useGetAddressType();
  let msgIcon: IconType = MdInfo;
  let content: ReactNode;
  const isIBC = Boolean(
    log?.events?.find((event) => event.type === "send_packet")
  );
  const { "@type": type, ...body } = msgBody;

  switch (type) {
    case "/cosmwasm.wasm.v1.MsgStoreCode":
      msgIcon = MdUpload;
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
                canCopyWithHover
                fontSize="24px"
                textVariant="body1"
              />
            </>
          )}
        </>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract":
      msgIcon = MdAdd;
      content = (
        <>
          Instantiate
          {log && (
            <ExplorerLink
              type="contract_address"
              value={
                findAttribute([log], "instantiate", "_contract_address").value
              }
              canCopyWithHover
              textVariant="body1"
            />
          )}
          <p>from</p>
          <ExplorerLink
            type="code_id"
            value={body.code_id}
            canCopyWithHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract2":
      msgIcon = MdAdd;
      content = (
        <>
          Instantiate2
          {log && (
            <ExplorerLink
              type="contract_address"
              value={
                findAttribute([log], "instantiate", "_contract_address").value
              }
              canCopyWithHover
              textVariant="body1"
            />
          )}
          <p>from</p>
          <ExplorerLink
            type="code_id"
            value={body.code_id}
            canCopyWithHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgExecuteContract":
      msgIcon = MdMessage;
      content = (
        <>
          Execute
          <span style={{ fontWeight: 700 }}>{Object.keys(body.msg).at(0)}</span>
          on
          <ExplorerLink
            type="contract_address"
            value={body.contract}
            canCopyWithHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgMigrateContract":
      msgIcon = MdFormatIndentIncrease;
      content = (
        <>
          Migrate{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract}
            canCopyWithHover
            textVariant="body1"
          />{" "}
          to Code ID{" "}
          <ExplorerLink
            type="code_id"
            value={body.code_id}
            canCopyWithHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgUpdateAdmin":
      msgIcon = MdManageAccounts;
      content = (
        <>
          Update admin on{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract}
            canCopyWithHover
            textVariant="body1"
          />{" "}
          to{" "}
          <ExplorerLink
            type={getAddressType(body.new_admin)}
            value={body.new_admin}
            canCopyWithHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgClearAdmin":
      msgIcon = MdPersonRemove;
      content = (
        <>
          Clear admin on{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract}
            canCopyWithHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmos.bank.v1beta1.MsgSend":
      {
        const toAddress = body.to_address as Addr;
        msgIcon = MdSend;
        content = (
          <>
            Send assets to
            <ExplorerLink
              type={getAddressType(toAddress)}
              value={toAddress}
              canCopyWithHover
              textVariant="body1"
            />
          </>
        );
      }
      break;
    case "/cosmos.gov.v1beta1.MsgSubmitProposal":
      msgIcon = MdMail;
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
                canCopyWithHover
                textVariant="body1"
              />
            </>
          )}
        </>
      );
      break;
    case "/cosmos.gov.v1beta1.MsgVote":
      msgIcon = MdOutlineHowToVote;
      content = (
        <>
          Vote{" "}
          <span style={{ fontWeight: 700 }}>
            {voteOption[body.option as keyof typeof voteOption]}
          </span>{" "}
          on proposal ID{" "}
          <ExplorerLink
            type="proposal_id"
            value={body.proposal_id}
            canCopyWithHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "/cosmos.staking.v1beta1.MsgDelegate":
      msgIcon = MdDonutLarge;
      content = (
        <>
          Delegate by{" "}
          <ExplorerLink
            type={getAddressType(body.delegator_address)}
            value={body.delegator_address}
            canCopyWithHover
            textVariant="body1"
          />{" "}
          to{" "}
          <ExplorerLink
            type={getAddressType(body.validator_address)}
            value={body.validator_address}
            canCopyWithHover
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
        <Icon as={msgIcon} boxSize={6} color="lilac.main" />
        {content}
        {isIBC && <Badge variant="honeydew">IBC</Badge>}
      </Flex>
      <Icon
        as={FiChevronDown}
        color="pebble.600"
        boxSize={5}
        transform={isExpand ? "rotate(180deg)" : "rotate(0)"}
        transition="all .25s ease-in-out"
      />
    </Flex>
  );
};
