import { Flex, Tag } from "@chakra-ui/react";

import { RenderActionMessages } from "../action-msg/ActionMessages";
import { ExplorerLink } from "../ExplorerLink";
import { CustomIcon } from "../icon";
import { MobileLabel } from "lib/pages/account-details/components/mobile/MobileLabel";
import type { Transaction } from "lib/types";

import { DefaultMobileCard } from "./DefaultMobileCard";

interface BlockTxCardProps {
  blockTx: Transaction;
}
export const BlockTxCard = ({ blockTx }: BlockTxCardProps) => {
  return (
    <DefaultMobileCard
      topContent={
        <Flex align="center" gap={2}>
          {blockTx.success ? (
            <CustomIcon name="check" color="success.main" />
          ) : (
            <CustomIcon name="close" color="error.main" />
          )}
          <ExplorerLink
            value={blockTx.hash.toLocaleUpperCase()}
            type="tx_hash"
            showCopyOnHover
          />
        </Flex>
      }
      middleContent={
        <Flex>
          <RenderActionMessages transaction={blockTx} />
          {blockTx.isIbc && (
            <Tag variant="accent-dark" size="sm" w={8} justifyContent="center">
              IBC
            </Tag>
          )}
        </Flex>
      }
      bottomContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column" gap={0}>
            <MobileLabel label="sender" />
            <ExplorerLink
              value={blockTx.sender}
              type="user_address"
              showCopyOnHover
            />
          </Flex>
        </Flex>
      }
    />
  );
};
