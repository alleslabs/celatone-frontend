import type { LinkType } from "lib/components/ExplorerLink";
import type { Option, TokenWithValue } from "lib/types";

import { Flex, Tag, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { snakeCase } from "snake-case";

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
  if (!type) return <Text variant="body2">Message unavailable</Text>;
  return (
    <>
      <Text variant="body2">
        {type} {text1}
      </Text>
      {tokens?.map((token: TokenWithValue, index: number) => (
        <Flex key={token.denom}>
          <MsgToken
            token={token}
            // TODO: add `ampCopierSection` later
          />
          {tokens.length > 1 && index < tokens.length - 1 && (
            <>
              {index < tokens.length - 2 ? (
                <Text>,</Text>
              ) : (
                <Text ml={1}>and</Text>
              )}
            </>
          )}
        </Flex>
      ))}
      {/* Tags */}
      {tags?.map((tag, index: number) => (
        <Tag
          key={index.toString() + tag}
          color={tag ? "text.main" : "text.disabled"}
          size="sm"
          textAlign="left"
          variant="gray"
          wordBreak="break-word"
        >
          {tag ? snakeCase(tag) : "undefined"}
        </Tag>
      ))}
      {/* Tag left over */}
      {tags && length && length - tags.length > 0 && (
        <Tag size="sm" textAlign="left" variant="gray" wordBreak="break-word">
          +{length - tags.length}
        </Tag>
      )}
      {/* Length  */}
      {!tags && length && (
        <Tag size="sm" textAlign="left" variant="gray" wordBreak="break-word">
          {length}
        </Tag>
      )}
      {/* Text2 */}
      <Text variant="body2">{text2}</Text>
      {/* Link */}
      {link1 && (
        <ExplorerLink
          copyValue={link1.copyValue}
          showCopyOnHover
          // Should ellipse when it is not tx hash, contract addr, user addr
          textFormat={link1.type !== "code_id" ? "truncate" : "normal"}
          type={link1.type}
          value={link1.value}
        />
      )}
      {/* Text3 */}
      <Text variant="body2">{text3}</Text>
      {/* Link2 */}
      {link2 && (
        <ExplorerLink
          copyValue={link2.copyValue}
          showCopyOnHover
          // Should ellipse when it is not tx hash, contract addr, user addr
          textFormat={link2.type !== "code_id" ? "truncate" : "normal"}
          type={link2.type}
          value={link2.value}
        />
      )}
    </>
  );
};
