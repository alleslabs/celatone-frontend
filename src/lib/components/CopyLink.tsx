import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text, useClipboard } from "@chakra-ui/react";
import { useState } from "react";

import { useCurrentChain } from "lib/app-provider";
import { AmpTrackCopier } from "lib/services/amplitude";

import { CustomIcon } from "./icon";
import { Tooltip } from "./Tooltip";

interface CopyLinkProps extends FlexProps {
  value: string;
  amptrackSection?: string;
  type: string;
  withoutIcon?: boolean;
}

export const CopyLink = ({
  value,
  amptrackSection,
  type,
  withoutIcon,
  ...flexProps
}: CopyLinkProps) => {
  const { address } = useCurrentChain();
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
        {...flexProps}
      >
        <Text
          variant="body2"
          color="secondary.main"
          transition="all .25s ease-in-out"
        >
          {value === address ? `${value} (Me)` : value}
        </Text>
        {!withoutIcon && (
          <CustomIcon
            cursor="pointer"
            marginLeft={2}
            name="copy"
            boxSize={3}
            color="gray.600"
          />
        )}
      </Flex>
    </Tooltip>
  );
};
