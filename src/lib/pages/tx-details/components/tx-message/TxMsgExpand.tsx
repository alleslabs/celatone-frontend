/* eslint-disable complexity */
import { Flex, Tag } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { findAttribute } from "@cosmjs/stargate/build/logs";
import type { ReactNode } from "react";

import { useGetAddressType, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
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
  isSingleMsg,
  assetInfos,
  onClick,
}: TxMsgExpandProps) => {
  const getAddressType = useGetAddressType();
  const { "@type": type, ...body } = msgBody;
  const isMobile = useMobile();
  const isIBC =
    Boolean(log?.events?.find((event) => event.type === "send_packet")) ||
    type.startsWith("/ibc");
  let msgIcon: IconKeys = "info-circle";
  let content: ReactNode;
  switch (type) {
    case "/cosmwasm.wasm.v1.MsgStoreCode":
      msgIcon = "upload";
      content = (
        <Flex display="inline">
          Upload Wasm{" "}
          {log && (
            <>
              {" "}
              and stored as{" "}
              <ExplorerLink
                type="code_id"
                value={findAttribute([log], "store_code", "code_id").value}
                showCopyOnHover
                fontSize="24px"
                textVariant="body1"
                ampCopierSection="tx_page_message_header_code"
              />
            </>
          )}
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract":
      msgIcon = "instantiate";
      content = (
        <Flex display="inline">
          Instantiate{" "}
          {log && (
            <ExplorerLink
              type="contract_address"
              value={
                findAttribute([log], "instantiate", "_contract_address").value
              }
              showCopyOnHover
              textVariant="body1"
              ampCopierSection="tx_page_message_header_contract"
            />
          )}{" "}
          from{" "}
          <ExplorerLink
            type="code_id"
            value={body.code_id}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_code"
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract2":
      msgIcon = "instantiate";
      content = (
        <Flex display="inline">
          Instantiate2{" "}
          {log && (
            <ExplorerLink
              type="contract_address"
              value={
                findAttribute([log], "instantiate", "_contract_address").value
              }
              showCopyOnHover
              textVariant="body1"
              ampCopierSection="tx_page_message_header_contract"
            />
          )}{" "}
          from{" "}
          <ExplorerLink
            type="code_id"
            value={body.code_id}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_code"
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgExecuteContract":
      msgIcon = "execute";
      content = (
        <Flex display="inline">
          Execute{" "}
          <span style={{ fontWeight: 700 }}>{Object.keys(body.msg).at(0)}</span>{" "}
          on{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_contract"
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgMigrateContract":
      msgIcon = "migrate";
      content = (
        <Flex display="inline">
          Migrate{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_contract"
          />{" "}
          to Code ID{" "}
          <ExplorerLink
            type="code_id"
            value={body.code_id}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_code"
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgUpdateAdmin":
      msgIcon = "admin-edit";
      content = (
        <Flex display="inline">
          Update admin on{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_contract"
          />{" "}
          to{" "}
          <ExplorerLink
            type={getAddressType(body.new_admin)}
            value={body.new_admin}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_admin"
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgClearAdmin":
      msgIcon = "admin-clear";
      content = (
        <Flex display="inline">
          Clear admin on{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_contract"
          />
        </Flex>
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
          <Flex display="inline">
            Send {assetText} to{" "}
            <ExplorerLink
              type={getAddressType(toAddress)}
              value={toAddress}
              showCopyOnHover
              textVariant="body1"
              ampCopierSection="tx_page_message_header_send_address"
            />
          </Flex>
        );
      }
      break;
    case "/cosmos.gov.v1beta1.MsgSubmitProposal":
      msgIcon = "submit-proposal";
      content = (
        <Flex display="inline">
          Submit Proposal {body.is_expedited && " Expedited "}
          {log && (
            <>
              ID{" "}
              <ExplorerLink
                type="proposal_id"
                value={
                  findAttribute([log], "submit_proposal", "proposal_id").value
                }
                showCopyOnHover
                textVariant="body1"
                ampCopierSection="tx_page_message_header_proposal"
              />
            </>
          )}
        </Flex>
      );
      break;
    case "/cosmos.gov.v1beta1.MsgVote":
      msgIcon = "vote";
      content = (
        <Flex display="inline">
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
            ampCopierSection="tx_page_message_header_proposal"
          />
        </Flex>
      );
      break;
    case "/cosmos.staking.v1beta1.MsgDelegate":
      msgIcon = "delegate";
      content = (
        <Flex display="inline">
          Delegate by{" "}
          <ExplorerLink
            type={getAddressType(body.delegator_address)}
            value={body.delegator_address}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_delegator"
          />{" "}
          to{" "}
          <ExplorerLink
            type={getAddressType(body.validator_address)}
            value={body.validator_address}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_validator"
          />
        </Flex>
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
      onClick={() => {
        AmpTrack(AmpEvent.USE_TX_MSG_EXPAND, {
          action: isExpand ? "collapse" : "expand",
          msg: type,
          ibc: isIBC,
          isSingleMsg,
        });
        onClick();
      }}
      _hover={{ backgroundColor: "gray.800" }}
      _after={{
        content: '""',
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        h: "1px",
        w: "99%",
        bg: "gray.700",
      }}
    >
      <Flex
        align={{ base: "start", md: "center" }}
        gap={2}
        fontSize="16px"
        fontWeight={500}
      >
        <CustomIcon
          name={msgIcon}
          boxSize={4}
          color="secondary.main"
          m={0}
          mt={{ base: 1, md: 0 }}
        />
        {content}
        {isIBC && !isMobile && (
          <Tag mx={2} variant="accent-dark" size="md" minW="hug-content">
            IBC
          </Tag>
        )}
      </Flex>
      <Flex>
        {isIBC && isMobile && (
          <Tag mx={2} variant="accent-dark" size="sm" minW="hug-content">
            IBC
          </Tag>
        )}
        <CustomIcon
          name="chevron-down"
          color="gray.600"
          boxSize={4}
          transform={isExpand ? "rotate(180deg)" : "rotate(0)"}
          transition="all .25s ease-in-out"
          m={0}
        />
      </Flex>
    </Flex>
  );
};
