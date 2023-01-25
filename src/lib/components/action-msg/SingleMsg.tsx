import { Tag, Text, Box, Flex } from "@chakra-ui/react";
import { snakeCase } from "snake-case";

import type { LinkType } from "lib/components/ExplorerLink";
import { ExplorerLink } from "lib/components/ExplorerLink";

interface LinkElement {
  type: LinkType;
  value: string;
  copyValue?: string;
}

export interface SingleMsgProps {
  type: string;
  text1?: string;
  bolds?: Array<string>;
  tags?: Array<string>;
  length?: number;
  text2?: string;
  link1?: LinkElement;
  text3?: string;
  link2?: LinkElement;
}

export const SingleMsg = ({
  type,
  text1,
  bolds,
  tags,
  length,
  text2,
  link1,
  text3,
  link2,
}: SingleMsgProps) => {
  if (!type) return <Text>Message Unavailable</Text>;
  return (
    <Flex gap={1} alignItems="center" flexWrap="wrap">
      {type} {text1}
      {bolds && (
        <Box display="inline-flex">
          {bolds.map((bold: string, index: number) => (
            <Text key={index.toString() + bold} fontWeight="medium">
              {bold}
            </Text>
          ))}
        </Box>
      )}
      {/* Tags  */}
      {tags &&
        tags.map((tag: string, index: number) => (
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
          canCopyWithHover
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
          canCopyWithHover
          // Should ellipse when it is not tx hash, contract addr, user addr
          textFormat={link2.type !== "code_id" ? "truncate" : "normal"}
        />
      )}
    </Flex>
  );
};
