import type { Coin } from "@cosmjs/stargate";
import type { BechAddr } from "lib/types";
import type { VoteOption } from "lib/utils";

import { Flex, Tag, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useEvmConfig, useGetAddressType, useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { WasmVerifyBadgeById } from "lib/components/WasmVerifyBadge";
import { useAssetInfos } from "lib/services/assetService";
import { useMovePoolInfos } from "lib/services/move/poolService";
import {
  coinToTokenWithValue,
  extractMsgType,
  findAttr,
  formatTokenWithValue,
  getTxBadges,
  voteOption,
} from "lib/utils";
import { type ReactNode, useRef, useState } from "react";

import type { TxMsgData } from ".";

interface TxMsgExpandProps extends TxMsgData {
  isExpand: boolean;
  onClick: () => void;
}

export const TxMsgExpand = ({
  compact,
  isExpand,
  log,
  msgBody,
  msgCount,
  onClick,
}: TxMsgExpandProps) => {
  const isMobile = useMobile();
  const evm = useEvmConfig({ shouldRedirect: false });
  const getAddressType = useGetAddressType();
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const { data: movePoolInfos } = useMovePoolInfos({ withPrices: false });

  const { "@type": type, ...body } = msgBody;
  const { isEvm, isIbc, isOpinit } = getTxBadges(type, log);

  const [isHoverText, setIsHoverText] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isHoverOverflowContent =
    isHoverText && !isMobile && ref.current
      ? ref.current.scrollWidth > ref.current.clientWidth
      : false;

  let msgLabel: string = "";
  let content: ReactNode;
  switch (type) {
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
            : formatTokenWithValue({ isEvm: evm.enabled, token: singleToken });
        msgLabel = "Send";
        content = (
          <Flex display="inline" gap={1}>
            {assetText} to{" "}
            <ExplorerLink
              ampCopierSection="tx_page_message_header_send_address"
              showCopyOnHover
              type={getAddressType(toAddress)}
              value={toAddress}
            />
          </Flex>
        );
      }
      break;
    case "/cosmos.gov.v1.MsgSubmitProposal":
    case "/cosmos.gov.v1beta1.MsgSubmitProposal":
      msgLabel = "Submit proposal";
      content = (
        <Flex display="inline" gap={1}>
          {(body.expedited as boolean) && " expedited "}
          {log && (
            <>
              ID{" "}
              <ExplorerLink
                ampCopierSection="tx_page_message_header_proposal"
                showCopyOnHover
                type="proposal_id"
                value={
                  findAttr(log.events, "submit_proposal", "proposal_id") ?? ""
                }
              />
            </>
          )}
        </Flex>
      );
      break;
    case "/cosmos.gov.v1beta1.MsgVote":
      msgLabel = "Vote";
      content = (
        <Flex align="center" gap={1}>
          {" "}
          <span style={{ fontWeight: 700 }}>
            {voteOption[body.option as VoteOption]}
          </span>{" "}
          on proposal ID{" "}
          <ExplorerLink
            ampCopierSection="tx_page_message_header_proposal"
            showCopyOnHover
            type="proposal_id"
            value={body.proposalId as string}
          />
        </Flex>
      );
      break;
    case "/cosmos.staking.v1beta1.MsgDelegate":
      msgLabel = "Delegate";
      content = (
        <Flex display="inline" gap={1}>
          by{" "}
          <ExplorerLink
            ampCopierSection="tx_page_message_header_delegator"
            showCopyOnHover
            type={getAddressType(body.delegatorAddress as string)}
            value={body.delegatorAddress as string}
          />{" "}
          to{" "}
          <ExplorerLink
            ampCopierSection="tx_page_message_header_validator"
            showCopyOnHover
            type={getAddressType(body.validatorAddress as string)}
            value={body.validatorAddress as string}
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgClearAdmin":
      msgLabel = "Clear admin";
      content = (
        <Flex display="inline" gap={1}>
          on{" "}
          <ExplorerLink
            ampCopierSection="tx_page_message_header_contract"
            showCopyOnHover
            type="contract_address"
            value={body.contract as string}
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgExecuteContract":
      msgLabel = "Execute";
      content = (
        <Flex display="inline" gap={1}>
          {" "}
          <span style={{ fontWeight: 700 }}>
            {Object.keys(body.msg as Record<string, unknown>)[0]}
          </span>{" "}
          on{" "}
          <ExplorerLink
            ampCopierSection="tx_page_message_header_contract"
            showCopyOnHover
            type="contract_address"
            value={body.contract as string}
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract":
      msgLabel = "Instantiate";
      content = (
        <Flex display="inline" gap={1}>
          {" "}
          {log && (
            <ExplorerLink
              ampCopierSection="tx_page_message_header_contract"
              showCopyOnHover
              type="contract_address"
              value={
                findAttr(log.events, "instantiate", "_contract_address") ?? ""
              }
            />
          )}{" "}
          from{" "}
          <ExplorerLink
            ampCopierSection="tx_page_message_header_code"
            rightIcon={<WasmVerifyBadgeById codeId={Number(body.codeId)} />}
            showCopyOnHover
            type="code_id"
            value={body.codeId as string}
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract2":
      msgLabel = "Instantiate2";
      content = (
        <Flex display="inline" gap={1}>
          {" "}
          {log && (
            <ExplorerLink
              ampCopierSection="tx_page_message_header_contract"
              showCopyOnHover
              type="contract_address"
              value={
                findAttr(log.events, "instantiate", "_contract_address") ?? ""
              }
            />
          )}{" "}
          from{" "}
          <ExplorerLink
            ampCopierSection="tx_page_message_header_code"
            rightIcon={<WasmVerifyBadgeById codeId={Number(body.codeId)} />}
            showCopyOnHover
            type="code_id"
            value={body.codeId as string}
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgMigrateContract":
      msgLabel = "Migrate";
      content = (
        <Flex display="inline" gap={1}>
          {" "}
          <ExplorerLink
            ampCopierSection="tx_page_message_header_contract"
            showCopyOnHover
            type="contract_address"
            value={body.contract as string}
          />{" "}
          to code ID{" "}
          <ExplorerLink
            ampCopierSection="tx_page_message_header_code"
            showCopyOnHover
            type="code_id"
            value={body.codeId as string}
          />
        </Flex>
      );
      break;
    case "/cosmwasm.wasm.v1.MsgStoreCode": {
      const codeId = findAttr(log?.events, "store_code", "code_id") ?? "";

      msgLabel = "Upload wasm";
      content = (
        <Flex display="inline" gap={1}>
          {" "}
          {log && (
            <>
              {" "}
              and stored as{" "}
              <ExplorerLink
                ampCopierSection="tx_page_message_header_code"
                fontSize="24px"
                rightIcon={<WasmVerifyBadgeById codeId={Number(codeId)} />}
                showCopyOnHover
                type="code_id"
                value={codeId}
              />
            </>
          )}
        </Flex>
      );
      break;
    }
    case "/cosmwasm.wasm.v1.MsgUpdateAdmin":
      msgLabel = "Update admin";
      content = (
        <Flex display="inline" gap={1}>
          on{" "}
          <ExplorerLink
            ampCopierSection="tx_page_message_header_contract"
            showCopyOnHover
            type="contract_address"
            value={body.contract as string}
          />{" "}
          to{" "}
          <ExplorerLink
            ampCopierSection="tx_page_message_header_admin"
            showCopyOnHover
            type={getAddressType(body.newAdmin as string)}
            value={body.newAdmin as string}
          />
        </Flex>
      );
      break;
    case "/initia.move.v1.MsgExecute":
    case "/initia.move.v1.MsgExecuteJSON":
      msgLabel = `${body.moduleName}::${body.functionName}`;
      break;
    default: {
      msgLabel = extractMsgType(type);
      break;
    }
  }

  return (
    <Flex
      _after={
        compact
          ? {}
          : {
              bg: "gray.700",
              bottom: 0,
              content: '""',
              h: "1px",
              left: "50%",
              position: "absolute",
              transform: "translateX(-50%)",
              w: "99%",
            }
      }
      _hover={compact ? {} : { backgroundColor: "gray.800" }}
      align="center"
      background={isHoverOverflowContent ? "gray.800" : "transparent"}
      borderRadius={compact && !isHoverOverflowContent ? "0px" : "8px"}
      cursor="pointer"
      justify="space-between"
      marginTop={isHoverOverflowContent ? "-30px" : "0px"}
      overflow={compact && !isHoverOverflowContent ? "hidden" : "visible"}
      p={compact ? (isHoverOverflowContent ? "12px" : "") : "16px 8px"}
      position={isHoverOverflowContent ? "absolute" : "relative"}
      transition={isHoverOverflowContent ? "" : "background 0.25s ease-in-out"}
      width="auto"
      zIndex={isHoverOverflowContent ? 1 : "auto"}
      onClick={() => {
        track(AmpEvent.USE_TX_MSG_EXPAND, {
          action: isExpand ? "collapse" : "expand",
          ibc: isIbc,
          isSingleMsg: msgCount === 1,
          msg: type,
        });
        onClick();
      }}
      onMouseOut={() => setIsHoverText(false)}
      onMouseOver={() => setIsHoverText(true)}
      ref={ref}
    >
      <Flex
        align="center"
        flexWrap={
          compact && !isHoverOverflowContent && !isMobile ? "nowrap" : "wrap"
        }
        fontSize="14px"
        gap={2}
      >
        <Tag gap={0.5} minWidth="auto" py={0} variant="gray">
          <Text variant="body2">{msgLabel}</Text>
        </Tag>
        {!compact || msgCount === 1 ? (
          <>
            {typeof content === "string" ? (
              <Text wordBreak="break-all">{content}</Text>
            ) : (
              content
            )}
          </>
        ) : (
          <Tag gap={0.5} minWidth="auto" variant="gray">
            <Text fontWeight={700} variant="body2">
              {msgCount}
            </Text>
          </Tag>
        )}
        {!isMobile && isIbc && (
          <Tag minW="hug-content" size="md" variant="secondary">
            IBC
          </Tag>
        )}
        {!isMobile && isOpinit && (
          <Tag minW="hug-content" size="md" variant="teal">
            OPInit
          </Tag>
        )}
        {!isMobile && isEvm && (
          <Tag minW="hug-content" size="md" variant="primary-light">
            EVM
          </Tag>
        )}
      </Flex>
      <Flex align="center">
        {isMobile && isIbc && (
          <Tag minW="hug-content" size="sm" variant="secondary">
            IBC
          </Tag>
        )}
        {isMobile && isOpinit && (
          <Tag minW="hug-content" size="md" variant="teal">
            OPInit
          </Tag>
        )}
        {isMobile && isEvm && (
          <Tag minW="hug-content" size="md" variant="primary-light">
            EVM
          </Tag>
        )}
        {!compact && (
          <CustomIcon
            boxSize={4}
            color="gray.600"
            m={0}
            name="chevron-down"
            transform={isExpand ? "rotate(180deg)" : "rotate(0)"}
            transition="all 0.25s ease-in-out"
          />
        )}
      </Flex>
    </Flex>
  );
};
