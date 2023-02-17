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
  switch (type) {
    case "wasm/MsgStoreCode":
      {
        const codeId = log
          ? findAttribute([log], "store_code", "code_id").value
          : "N/A";
        msgIcon = MdUpload;
        content = (
          <>
            Upload Wasm to Code ID
            <ExplorerLink
              type="code_id"
              value={codeId}
              canCopyWithHover
              fontSize="24px"
              textVariant="body1"
            />
          </>
        );
      }
      break;
    case "wasm/MsgInstantiateContract":
      {
        const [codeId, contractAddr] = log
          ? [
              findAttribute([log], "instantiate", "code_id").value,
              findAttribute([log], "instantiate", "_contract_address").value,
            ]
          : ["N/A", "N/A"];
        msgIcon = MdAdd;
        content = (
          <>
            Instantiate
            <ExplorerLink
              type="contract_address"
              value={contractAddr}
              canCopyWithHover
              textVariant="body1"
            />
            from
            <ExplorerLink
              type="code_id"
              value={codeId}
              canCopyWithHover
              textVariant="body1"
            />
          </>
        );
      }
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
        const toAddress = value.to_address as Addr;
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
      {
        const proposalId = log
          ? findAttribute([log], "submit_proposal", "proposal_id").value
          : "N/A";
        msgIcon = MdMail;
        content = (
          <>
            Submit Proposal ID
            <ExplorerLink
              type="proposal_id"
              value={proposalId}
              canCopyWithHover
              textVariant="body1"
            />
          </>
        );
      }
      break;
    default: {
      const typeSplit = type.split("/");
      const isIBC = Boolean(
        log?.events?.find((event) => event.type === "send_packet")
      );
      content = (
        <>
          {typeSplit[typeSplit.length - 1]}
          {isIBC && (
            <Badge variant="honeydew" ml={2}>
              IBC
            </Badge>
          )}
        </>
      );
      break;
    }
  }

  return (
    <Flex
      p="12px 16px"
      align="center"
      justify="space-between"
      borderRadius="8px 8px 0 0"
      transition="all .25s ease-in-out"
      cursor="pointer"
      onClick={onClick}
      borderBottom="1px solid"
      borderBottomColor="pebble.700"
      _hover={{ backgroundColor: "pebble.800" }}
    >
      <Flex align="center" gap={2} fontSize="16px" fontWeight={500}>
        <Icon as={msgIcon} boxSize={6} color="lilac.main" />
        {content}
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
