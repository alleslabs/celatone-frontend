import type { FlexProps, IconProps } from "@chakra-ui/react";
import { Flex, Text, useClipboard } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import { trackUseCopier } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";
import { truncate } from "lib/utils";

import { CustomIcon } from "./icon";
import { Tooltip } from "./Tooltip";

interface CopyLinkProps extends FlexProps {
  amptrackSection?: string;
  isTruncate?: boolean;
  showCopyOnHover?: boolean;
  type: string;
  value: string;
  withoutIcon?: boolean;
}

export const CopyLink = ({
  amptrackSection,
  isTruncate = false,
  showCopyOnHover = false,
  type,
  value,
  withoutIcon,
  ...flexProps
}: CopyLinkProps) => {
  const { address } = useCurrentChain();
  const { hasCopied, onCopy, setValue } = useClipboard(value);
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

  useEffect(() => {
    setValue(value);
  }, [value, setValue]);

  const textValue = isTruncate ? truncate(value) : value;
  return (
    <Tooltip
      isOpen={isHover || hasCopied}
      label={hasCopied ? "Copied!" : "Click to copy"}
      closeOnClick={false}
    >
      <Flex
        align="center"
        display={{ base: "inline", md: "flex" }}
        w="fit-content"
        _hover={{
          "& > p": { color: "primary.light" },
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        }}
        cursor="pointer"
        onClick={() => {
          trackUseCopier(type, amptrackSection);
          onCopy();
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        {...flexProps}
      >
        <Text
          display="inline"
          variant="body2"
          color="primary.main"
          fontFamily="mono"
          transition="all 0.25s ease-in-out"
          wordBreak="break-all"
        >
          {value === address ? `${textValue} (Me)` : textValue}
        </Text>
        {!withoutIcon && (
          <CustomIcon
            display={displayIcon}
            marginLeft={2}
            name="copy"
            boxSize={3}
            color="gray.600"
            cursor="pointer"
          />
        )}
      </Flex>
    </Tooltip>
  );
};
