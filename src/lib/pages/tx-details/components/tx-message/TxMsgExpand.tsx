/* eslint-disable complexity */
import { Flex, Tag, Text } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { findAttribute } from "@cosmjs/stargate/build/logs";
import type { ReactNode } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useGetAddressType, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import type { BechAddr } from "lib/types";
import type { VoteOption } from "lib/utils";
import {
  coinToTokenWithValue,
  extractMsgType,
  formatTokenWithValue,
  voteOption,
} from "lib/utils";

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
  onClick,
}: TxMsgExpandProps) => {
  const isMobile = useMobile();
  const getAddressType = useGetAddressType();
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const { data: movePoolInfos } = useMovePoolInfos({ withPrices: false });

  const { "@type": type, ...body } = msgBody;
  const isIBC =
    Boolean(log?.events.find((event) => event.type === "send_packet")) ||
    type.startsWith("/ibc");
  const isOpinit = Boolean(type.startsWith("/opinit"));

  let msgIcon: IconKeys = "file";
  let content: ReactNode;
  switch (type) {
    case "/cosmwasm.wasm.v1.MsgStoreCode":
      msgIcon = "upload";
      content = (
        <Flex gap={1}>
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
        <Flex gap={1}>
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
            value={body.codeId as string}
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
        <Flex gap={1}>
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
            value={body.codeId as string}
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
        <Flex gap={1}>
          Execute{" "}
          <span style={{ fontWeight: 700 }}>
            {Object.keys(body.msg as Record<string, unknown>)[0]}
          </span>{" "}
          on{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract as string}
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
        <Flex gap={1}>
          Migrate{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract as string}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_contract"
          />{" "}
          to Code ID{" "}
          <ExplorerLink
            type="code_id"
            value={body.codeId as string}
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
        <Flex gap={1}>
          Update admin on{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract as string}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_contract"
          />{" "}
          to{" "}
          <ExplorerLink
            type={getAddressType(body.newAdmin as string)}
            value={body.newAdmin as string}
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
        <Flex gap={1}>
          Clear admin on{" "}
          <ExplorerLink
            type="contract_address"
            value={body.contract as string}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_contract"
          />
        </Flex>
      );
      break;
    case "/cosmos.bank.v1beta1.MsgSend":
      {
        const toAddress = body.toAddress as BechAddr;
        const singleCoin = (body.amount as Coin[])[0];
        const singleToken = coinToTokenWithValue(
          singleCoin.denom,
          singleCoin.amount,
          assetInfos,
          movePoolInfos
        );
        const assetText =
          (body.amount as Coin[]).length > 1
            ? "assets"
            : formatTokenWithValue(singleToken);
        msgIcon = "send";
        content = (
          <Flex gap={1}>
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
    case "/cosmos.gov.v1.MsgSubmitProposal":
      msgIcon = "submit-proposal";
      content = (
        <Flex gap={1}>
          Submit Proposal {(body.isExpedited as boolean) && " Expedited "}
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
        <Flex gap={1}>
          Vote{" "}
          <span style={{ fontWeight: 700 }}>
            {voteOption[body.option as VoteOption]}
          </span>{" "}
          on proposal ID{" "}
          <ExplorerLink
            type="proposal_id"
            value={body.proposalId as string}
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
        <Flex gap={1}>
          Delegate by{" "}
          <ExplorerLink
            type={getAddressType(body.delegatorAddress as string)}
            value={body.delegatorAddress as string}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_delegator"
          />{" "}
          to{" "}
          <ExplorerLink
            type={getAddressType(body.validatorAddress as string)}
            value={body.validatorAddress as string}
            showCopyOnHover
            textVariant="body1"
            ampCopierSection="tx_page_message_header_validator"
          />
        </Flex>
      );
      break;
    default: {
      content = extractMsgType(type);
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
      transition="all 0.25s ease-in-out"
      cursor="pointer"
      onClick={() => {
        track(AmpEvent.USE_TX_MSG_EXPAND, {
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
        <Text wordBreak="break-all">{content}</Text>
        {!isMobile && isIBC && (
          <Tag mx={2} variant="accent-dark" size="md" minW="hug-content">
            IBC
          </Tag>
        )}
        {!isMobile && isOpinit && (
          <Tag mx={2} variant="teal" size="md" minW="hug-content">
            OPInit
          </Tag>
        )}
      </Flex>
      <Flex>
        {isMobile && isIBC && (
          <Tag mx={2} variant="accent-dark" size="sm" minW="hug-content">
            IBC
          </Tag>
        )}
        {isMobile && isOpinit && (
          <Tag mx={2} variant="teal" size="md" minW="hug-content">
            OPInit
          </Tag>
        )}
        <CustomIcon
          name="chevron-down"
          color="gray.600"
          boxSize={4}
          transform={isExpand ? "rotate(180deg)" : "rotate(0)"}
          transition="all 0.25s ease-in-out"
          m={0}
        />
      </Flex>
    </Flex>
  );
};
