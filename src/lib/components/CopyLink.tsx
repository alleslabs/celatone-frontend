import type { FlexProps, IconProps } from "@chakra-ui/react";
import { Flex, Text, useClipboard } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { useCurrentChain } from "lib/app-provider";
import { AmpTrackCopier } from "lib/services/amplitude";

import { CustomIcon } from "./icon";
import { Tooltip } from "./Tooltip";

interface CopyLinkProps extends FlexProps {
  value: string;
  amptrackSection?: string;
  type: string;
  withoutIcon?: boolean;
  showCopyOnHover?: boolean;
}

export const CopyLink = ({
  value,
  amptrackSection,
  type,
  withoutIcon,
  showCopyOnHover = false,
  ...flexProps
}: CopyLinkProps) => {
  const { address } = useCurrentChain();
  const { onCopy, hasCopied } = useClipboard(value);
  const [isHover, setIsHover] = useState(false);

  // TODO - Refactor
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
        {...flexProps}
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
        {!withoutIcon && (
          <CustomIcon
            display={displayIcon}
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
