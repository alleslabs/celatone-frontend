import type { FlexProps, IconProps } from "@chakra-ui/react";
import { Flex, Text, Tooltip, useClipboard } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useMemo, useState } from "react";

import { AmpTrackCopier } from "lib/services/amplitude";

import { CustomIcon } from "./icon";

interface CopyLinkProps extends FlexProps {
  value: string;
  amptrackSection?: string;
  type: string;
  showCopyOnHover?: boolean;
}

export const CopyLink = ({
  value,
  amptrackSection,
  type,
  showCopyOnHover = false,
  ...flexProps
}: CopyLinkProps) => {
  const { address } = useWallet();
  const { onCopy, hasCopied } = useClipboard(value);
  const [isHover, setIsHover] = useState(false);

  const displayIcon = useMemo<IconProps["display"]>(() => {
    if (showCopyOnHover) {
      if (isHover) {
        return "flex";
      }
      return "none";
    }
    return undefined;
  }, [showCopyOnHover, isHover]);

  return (
    <Tooltip
      hasArrow
      isOpen={isHover || hasCopied}
      label={hasCopied ? "Copied!" : "Click to copy"}
      placement="top"
      arrowSize={8}
      bgColor="honeydew.darker"
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
          textDecorationColor: "lilac.light",
          "& > p": { color: "lilac.light" },
        }}
        cursor="pointer"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        {...flexProps}
      >
        <Text
          variant="body2"
          color="lilac.main"
          transition="all .25s ease-in-out"
        >
          {value === address ? `${value} (Me)` : value}
        </Text>
        <CustomIcon
          display={displayIcon}
          cursor="pointer"
          marginLeft={2}
          name="copy"
          boxSize={3}
        />
      </Flex>
    </Tooltip>
  );
};
