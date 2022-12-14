import { Tag, Text, Box, Flex } from "@chakra-ui/react";
import { snakeCase } from "snake-case";

import { ExplorerLink } from "lib/components/ExplorerLink";

export interface SingleMsgProps {
  type: string;
  text1?: string;
  bolds?: Array<string>;
  tags?: Array<string>;
  length?: number;
  text2?: string;
  link1?: string;
  // TODO - Change this
  link1Copy?: string;
  text3?: string;
  link2?: string;
}

export const SingleMsg = ({
  type,
  text1,
  bolds,
  tags,
  length,
  text2,
  link1,
  link1Copy,
  text3,
  link2,
}: SingleMsgProps) => {
  const linkType = (text: string) => {
    if (text.length === 63) {
      return "contract_address";
    }
    if (text.length === 64) {
      return "tx_hash";
    }
    if (text.length === 43) {
      return "user_address";
    }
    return undefined;
  };
  return (
    <Flex gap={1} alignItems="center">
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
            {snakeCase(tag)}
          </Tag>
        ))}
      {/* Tag left over */}
      {tags && length && length - tags.length > 0 && (
        <Tag borderRadius="full">+{length - tags.length} </Tag>
      )}
      {/* Length  */}
      {!tags && length && <Tag>{length}</Tag>}
      {/* Link */}
      {text2}
      {link1 && (
        <ExplorerLink
          value={link1}
          copy={link1Copy}
          type={linkType(link1Copy || link1)}
          isHover
        />
      )}
      {/* Text3 */} {text3} {/* Link with copy */}
      {link2 && <ExplorerLink value={link2} type={linkType(link2)} isHover />}
    </Flex>
  );
};
