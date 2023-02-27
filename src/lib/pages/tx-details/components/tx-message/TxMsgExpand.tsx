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
} from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { useGetAddressType } from "lib/hooks";
import type { Addr } from "lib/types";

import type { TxMsgData } from ".";

interface TxMsgExpandProps extends TxMsgData {
  isExpand: boolean;
  onClick: () => void;
}

export const TxMsgExpand = ({
  type,
  value,
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

  switch (type) {
    case "wasm/MsgStoreCode":
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
    case "wasm/MsgInstantiateContract":
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
            value={value.codeId}
            canCopyWithHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "wasm/MsgInstantiateContract2":
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
            value={value.codeId}
            canCopyWithHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "wasm/MsgExecuteContract":
      msgIcon = MdMessage;
      content = (
        <>
          Execute
          <span style={{ fontWeight: 700 }}>
            {Object.keys(value.msg).at(0)}
          </span>
          on
          <ExplorerLink
            type="contract_address"
            value={value.contract}
            canCopyWithHover
            textVariant="body1"
          />
        </>
      );
      break;
    case "cosmos-sdk/MsgSend":
      {
        const toAddress = value.toAddress as Addr;
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
    case "cosmos-sdk/MsgSubmitProposal":
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
    default: {
      const msgType = type.split("/");
      content =
        msgType.at(0) === "osmosis"
          ? msgType
              .pop()
              ?.split("-")
              .reduce(
                (acc, curr) => acc + curr[0].toUpperCase() + curr.slice(1),
                ""
              )
          : msgType[msgType.length - 1];
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
