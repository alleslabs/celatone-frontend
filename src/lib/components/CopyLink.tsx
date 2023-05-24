import { Flex, Text, useClipboard } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useState } from "react";

import { AmpTrackCopier } from "lib/services/amplitude";

import { CustomIcon } from "./icon";
import { Tooltip } from "./Tooltip";

interface CopyLinkProps {
  value: string;
  amptrackSection?: string;
  type: string;
}

export const CopyLink = ({ value, amptrackSection, type }: CopyLinkProps) => {
  const { address } = useWallet();
  const { onCopy, hasCopied } = useClipboard(value);
  const [isHover, setIsHover] = useState(false);
  return (
    <Tooltip
      isOpen={isHover || hasCopied}
      label={hasCopied ? "Copied!" : "Click to copy"}
      closeOnClick={false}
    >
      <Flex
        align="center"
        display={{ base: "inline", md: "flex" }}
        onClick={() => {
          AmpTrackCopier(amptrackSection, type);
          onCopy();
        }}
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "secondary.light",
          "& > p": { color: "secondary.light" },
        }}
        cursor="pointer"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Text
          wordBreak={{ base: "break-all", md: "inherit" }}
          variant="body2"
          color="secondary.main"
          transition="all .25s ease-in-out"
          display="inline"
        >
          {value === address ? `${value} (Me)` : value}
        </Text>
        <CustomIcon
          cursor="pointer"
          marginLeft={2}
          name="copy"
          boxSize={3}
          color="gray.600"
        />
      </Flex>
    </Tooltip>
  );
};
