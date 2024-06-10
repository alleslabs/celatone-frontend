import { Flex, Tag, Text } from "@chakra-ui/react";
import { snakeCase } from "snake-case";

import type { LinkType } from "lib/components/ExplorerLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Option, TokenWithValue } from "lib/types";

import { MsgToken } from "./MsgToken";

interface LinkElement {
  type: LinkType;
  value: string;
  copyValue?: string;
}

export interface SingleMsgProps {
  type: string;
  text1?: string;
  tokens?: TokenWithValue[];
  tags?: Option<string>[];
  length?: number;
  text2?: string;
  link1?: LinkElement;
  text3?: string;
  link2?: LinkElement;
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
}: SingleMsgProps) => {
  if (!type) return <Text variant="body2">Message Unavailable</Text>;
  return (
    <>
      <Text variant="body2">
        {type} {text1}
      </Text>
      {tokens?.map((token: TokenWithValue, index: number) => (
        <Flex>
          <MsgToken
            key={token.denom}
            token={token}
            // TODO: add `ampCopierSection` later
          />
          {index < tokens.length - 2 ? <Text>,</Text> : <Text ml={1}>and</Text>}
        </Flex>
      ))}
      {/* Tags  */}
      {tags?.map((tag, index: number) => (
        <Tag
          variant="gray"
          size="sm"
          wordBreak="break-word"
          textAlign="left"
          key={index.toString() + tag}
          color={tag ? "text.main" : "text.disabled"}
        >
          {tag ? snakeCase(tag) : "undefined"}
        </Tag>
      ))}
      {/* Tag left over */}
      {tags && length && length - tags.length > 0 && (
        <Tag variant="gray" size="sm" wordBreak="break-word" textAlign="left">
          +{length - tags.length}
        </Tag>
      )}
      {/* Length  */}
      {!tags && length && (
        <Tag variant="gray" size="sm" wordBreak="break-word" textAlign="left">
          {length}
        </Tag>
      )}
      {/* Text2 */}
      <Text variant="body2">{text2}</Text>
      {/* Link */}
      {link1 && (
        <ExplorerLink
          value={link1.value}
          copyValue={link1.copyValue}
          type={link1.type}
          showCopyOnHover
          // Should ellipse when it is not tx hash, contract addr, user addr
          textFormat={link1.type !== "code_id" ? "truncate" : "normal"}
        />
      )}
      {/* Text3 */}
      <Text variant="body2">{text3}</Text>
      {/* Link2 */}
      {link2 && (
        <ExplorerLink
          value={link2.value}
          copyValue={link2.copyValue}
          type={link2.type}
          showCopyOnHover
          // Should ellipse when it is not tx hash, contract addr, user addr
          textFormat={link2.type !== "code_id" ? "truncate" : "normal"}
        />
      )}
    </>
  );
};
