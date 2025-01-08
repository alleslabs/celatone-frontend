/* eslint-disable complexity */
import { Flex, Tag, Text } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import type { ReactNode } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useGetAddressType, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import { WasmVerifyBadgeById } from "lib/components/WasmVerifyBadge";
import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import type { BechAddr } from "lib/types";
import type { VoteOption } from "lib/utils";
import {
  coinToTokenWithValue,
  extractMsgType,
  findAttr,
  formatTokenWithValue,
  getTxBadges,
  voteOption,
} from "lib/utils";

import type { TxMsgData } from ".";

interface TxMsgExpandProps extends TxMsgData {
  isExpand: boolean;
  onClick: () => void;
}

export const TxMsgExpand = ({
  isExpand,
  isSingleMsg,
  log,
  msgBody,
  onClick,
}: TxMsgExpandProps) => {
  const isMobile = useMobile();
  const getAddressType = useGetAddressType();
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const { data: movePoolInfos } = useMovePoolInfos({ withPrices: false });

  const { "@type": type, ...body } = msgBody;
  const { isEvm, isIbc, isOpinit } = getTxBadges(type, log);

  let msgIcon: IconKeys = "file";
  let content: ReactNode;
  switch (type) {
    case "/cosmos.bank.v1beta1.MsgSend":
      {
        const toAddress = body.to_address as BechAddr;
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
          <Flex display="inline" gap={1}>
            Send {assetText} to{" "}
            <ExplorerLink
              textVariant="body1"
              type={getAddressType(toAddress)}
              value={toAddress}
              ampCopierSection="tx_page_message_header_send_address"
              showCopyOnHover
            />
          </Flex>
        );
      }
      break;
    case "/cosmos.gov.v1.MsgSubmitProposal":
    case "/cosmos.gov.v1beta1.MsgSubmitProposal":
      msgIcon = "submit-proposal";
      content = (
        <Flex display="inline" gap={1}>
          Submit Proposal {(body.is_expedited as boolean) && " Expedited "}
          {log && (
            <>
              ID{" "}
              <ExplorerLink
                textVariant="body1"
                type="proposal_id"
                value={
                  findAttr(log.events, "submit_proposal", "proposal_id") ?? ""
                }
                ampCopierSection="tx_page_message_header_proposal"
                showCopyOnHover
              />
            </>
          )}
        </Flex>
      );
      break;
    case "/cosmos.gov.v1beta1.MsgVote":
      msgIcon = "vote";
      content = (
        <Flex display="inline" gap={1}>
          Vote{" "}
          <span style={{ fontWeight: 700 }}>
            {voteOption[body.option as VoteOption]}
          </span>{" "}
          on proposal ID{" "}
          <ExplorerLink
            textVariant="body1"
            type="proposal_id"
            value={body.proposal_id as string}
            ampCopierSection="tx_page_message_header_proposal"
            showCopyOnHover
          />
        </Flex>
      );
      break;
    case "/cosmos.staking.v1beta1.MsgDelegate":
      msgIcon = "delegate";
      content = (
        <Flex display="inline" gap={1}>
          Delegate by{" "}
          <ExplorerLink
            textVariant="body1"
            type={getAddressType(body.delegator_address as string)}
            value={body.delegator_address as string}
            ampCopierSection="tx_page_message_header_delegator"
            showCopyOnHover
          />{" "}
          to{" "}
          <ExplorerLink
            textVariant="body1"
            type={getAddressType(body.validator_address as string)}
            value={body.validator_address as string}
            ampCopierSection="tx_page_message_header_validator"
            showCopyOnHover
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgClearAdmin":
      msgIcon = "admin-clear";
      content = (
        <Flex display="inline" gap={1}>
          Clear admin on{" "}
          <ExplorerLink
            textVariant="body1"
            type="contract_address"
            value={body.contract as string}
            ampCopierSection="tx_page_message_header_contract"
            showCopyOnHover
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgExecuteContract":
      msgIcon = "execute";
      content = (
        <Flex display="inline" gap={1}>
          Execute{" "}
          <span style={{ fontWeight: 700 }}>
            {Object.keys(body.msg as Record<string, unknown>)[0]}
          </span>{" "}
          on{" "}
          <ExplorerLink
            textVariant="body1"
            type="contract_address"
            value={body.contract as string}
            ampCopierSection="tx_page_message_header_contract"
            showCopyOnHover
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract":
      msgIcon = "instantiate";
      content = (
        <Flex display="inline" gap={1}>
          Instantiate{" "}
          {log && (
            <ExplorerLink
              textVariant="body1"
              type="contract_address"
              value={
                findAttr(log.events, "instantiate", "_contract_address") ?? ""
              }
              ampCopierSection="tx_page_message_header_contract"
              showCopyOnHover
            />
          )}{" "}
          from{" "}
          <ExplorerLink
            textVariant="body1"
            type="code_id"
            value={body.code_id as string}
            ampCopierSection="tx_page_message_header_code"
            rightIcon={<WasmVerifyBadgeById codeId={Number(body.code_id)} />}
            showCopyOnHover
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract2":
      msgIcon = "instantiate";
      content = (
        <Flex display="inline" gap={1}>
          Instantiate2{" "}
          {log && (
            <ExplorerLink
              textVariant="body1"
              type="contract_address"
              value={
                findAttr(log.events, "instantiate", "_contract_address") ?? ""
              }
              ampCopierSection="tx_page_message_header_contract"
              showCopyOnHover
            />
          )}{" "}
          from{" "}
          <ExplorerLink
            textVariant="body1"
            type="code_id"
            value={body.code_id as string}
            ampCopierSection="tx_page_message_header_code"
            rightIcon={<WasmVerifyBadgeById codeId={Number(body.code_id)} />}
            showCopyOnHover
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgMigrateContract":
      msgIcon = "migrate";
      content = (
        <Flex display="inline" gap={1}>
          Migrate{" "}
          <ExplorerLink
            textVariant="body1"
            type="contract_address"
            value={body.contract as string}
            ampCopierSection="tx_page_message_header_contract"
            showCopyOnHover
          />{" "}
          to Code ID{" "}
          <ExplorerLink
            textVariant="body1"
            type="code_id"
            value={body.code_id as string}
            ampCopierSection="tx_page_message_header_code"
            showCopyOnHover
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgStoreCode": {
      const codeId = findAttr(log?.events, "store_code", "code_id") ?? "";

      msgIcon = "upload";
      content = (
        <Flex display="inline" gap={1}>
          Upload Wasm{" "}
          {log && (
            <>
              {" "}
              and stored as{" "}
              <ExplorerLink
                textVariant="body1"
                type="code_id"
                value={codeId}
                ampCopierSection="tx_page_message_header_code"
                fontSize="24px"
                rightIcon={<WasmVerifyBadgeById codeId={Number(codeId)} />}
                showCopyOnHover
              />
            </>
          )}
        </Flex>
      );
      break;
    }
    case "/cosmwasm.wasm.v1.MsgUpdateAdmin":
      msgIcon = "admin-edit";
      content = (
        <Flex display="inline" gap={1}>
          Update admin on{" "}
          <ExplorerLink
            textVariant="body1"
            type="contract_address"
            value={body.contract as string}
            ampCopierSection="tx_page_message_header_contract"
            showCopyOnHover
          />{" "}
          to{" "}
          <ExplorerLink
            textVariant="body1"
            type={getAddressType(body.new_admin as string)}
            value={body.new_admin as string}
            ampCopierSection="tx_page_message_header_admin"
            showCopyOnHover
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
      _after={{
        bg: "gray.700",
        bottom: 0,
        content: '""',
        h: "1px",
        left: "50%",
        position: "absolute",
        transform: "translateX(-50%)",
        w: "99%",
      }}
      align="center"
      justify="space-between"
      p="16px 8px"
      _hover={{ backgroundColor: "gray.800" }}
      borderRadius="8px"
      cursor="pointer"
      onClick={() => {
        track(AmpEvent.USE_TX_MSG_EXPAND, {
          action: isExpand ? "collapse" : "expand",
          ibc: isIbc,
          isSingleMsg,
          msg: type,
        });
        onClick();
      }}
      position="relative"
      transition="all 0.25s ease-in-out"
    >
      <Flex
        align={{ base: "start", md: "center" }}
        gap={2}
        fontSize="16px"
        fontWeight={500}
      >
        <CustomIcon
          m={0}
          mt={{ base: 1, md: 0 }}
          name={msgIcon}
          boxSize={4}
          color="primary.main"
        />
        <Text wordBreak="break-all">{content}</Text>
        {!isMobile && isIbc && (
          <Tag minW="hug-content" mx={2} size="md" variant="secondary">
            IBC
          </Tag>
        )}
        {!isMobile && isOpinit && (
          <Tag minW="hug-content" mx={2} size="md" variant="teal">
            OPInit
          </Tag>
        )}
        {!isMobile && isEvm && (
          <Tag minW="hug-content" mx={2} size="md" variant="primary-light">
            EVM
          </Tag>
        )}
      </Flex>
      <Flex align="center">
        {isMobile && isIbc && (
          <Tag minW="hug-content" mx={2} size="sm" variant="secondary">
            IBC
          </Tag>
        )}
        {isMobile && isOpinit && (
          <Tag minW="hug-content" mx={2} size="md" variant="teal">
            OPInit
          </Tag>
        )}
        {isMobile && isEvm && (
          <Tag minW="hug-content" mx={2} size="md" variant="primary-light">
            EVM
          </Tag>
        )}
        <CustomIcon
          m={0}
          name="chevron-down"
          boxSize={4}
          color="gray.600"
          transform={isExpand ? "rotate(180deg)" : "rotate(0)"}
          transition="all 0.25s ease-in-out"
        />
      </Flex>
    </Flex>
  );
};
