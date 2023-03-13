import { Tag, Text, Flex, Tooltip } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { snakeCase } from "snake-case";

import { Copier } from "../copy";
import { CustomIcon } from "../icon";
import type { LinkType } from "lib/components/ExplorerLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Option } from "lib/types";
import { formatBalanceWithDenom } from "lib/utils";

interface LinkElement {
  type: LinkType;
  value: string;
  copyValue?: string;
}

interface Token {
  id: string;
  amount: string;
  symbol: Option<string>;
  precision: Option<number>;
}
export interface SingleMsgProps {
  type: string;
  text1?: string;
  tokens?: Token[];
  tags?: string[];
  length?: number;
  text2?: string;
  link1?: LinkElement;
  text3?: string;
  link2?: LinkElement;
  showCopyButton?: boolean;
}

export const SingleMsg = ({
  type,
  text1,
  tokens,
  tags,
  length,
  text2,
  link1,
  text3,
  link2,
  showCopyButton = false,
}: SingleMsgProps) => {
  if (!type) return <Text>Message Unavailable</Text>;
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      {type} {text1}
      {tokens?.map((token: Token, index: number) => (
        <Flex
          key={index.toString() + token}
          role="group"
          align="center"
          gap={1}
        >
          <Text fontWeight="medium">
            {formatBalanceWithDenom({
              coin: {
                denom: token.id,
                amount: token.amount,
              } as Coin,
              symbol: token.symbol,
              precision: token.precision,
            })}
          </Text>
          <Tooltip
            hasArrow
            label={`Token ID: ${token.id}`}
            placement="top"
            bg="honeydew.darker"
            maxW="240px"
          >
            <Flex cursor="pointer">
              <CustomIcon name="info-circle" boxSize="3" />
            </Flex>
          </Tooltip>
          <Copier
            display={showCopyButton ? "flex" : "none"}
            value={token.id}
            ml="4px"
            className="copy-button"
            copyLabel="Token ID Copied!"
          />
        </Flex>
      ))}
      {/* Tags  */}
      {tags?.map((tag: string, index: number) => (
        <Tag key={index.toString() + tag} borderRadius="full">
          {snakeCase(tag) || tag}
        </Tag>
      ))}
      {/* Tag left over */}
      {tags && length && length - tags.length > 0 && (
        <Tag borderRadius="full">+{length - tags.length} </Tag>
      )}
      {/* Length  */}
      {!tags && length && <Tag borderRadius="full">{length}</Tag>}
      {/* Text2 */}
      {text2}
      {/* Link */}
      {link1 && (
        <ExplorerLink
          value={link1.value}
          copyValue={link1.copyValue}
          type={link1.type}
          canCopyWithHover={!showCopyButton}
          // Should ellipse when it is not tx hash, contract addr, user addr
          textFormat={link1.type !== "code_id" ? "truncate" : "normal"}
        />
      )}
      {/* Text3 */}
      {text3}
      {/* Link2 */}
      {link2 && (
        <ExplorerLink
          value={link2.value}
          copyValue={link2.copyValue}
          type={link2.type}
          canCopyWithHover={!showCopyButton}
          // Should ellipse when it is not tx hash, contract addr, user addr
          textFormat={link2.type !== "code_id" ? "truncate" : "normal"}
        />
      )}
    </Flex>
  );
};
