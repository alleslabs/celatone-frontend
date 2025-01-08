import type { FlexProps, IconProps } from "@chakra-ui/react";
import { Flex, Text, useClipboard } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import { trackUseCopier } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";
import { truncate } from "lib/utils";

import { CustomIcon } from "./icon";
import { Tooltip } from "./Tooltip";

interface CopyLinkProps extends FlexProps {
  value: string;
  type: string;
  withoutIcon?: boolean;
  showCopyOnHover?: boolean;
  isTruncate?: boolean;
  amptrackSection?: string;
}

export const CopyLink = ({
  value,
  type,
  withoutIcon,
  showCopyOnHover = false,
  isTruncate = false,
  amptrackSection,
  ...flexProps
}: CopyLinkProps) => {
  const { address } = useCurrentChain();
  const { onCopy, hasCopied, setValue } = useClipboard(value);
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
        w="fit-content"
        align="center"
        display={{ base: "inline", md: "flex" }}
        onClick={() => {
          trackUseCopier(type, amptrackSection);
          onCopy();
        }}
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "primary.light",
          "& > p": { color: "primary.light" },
        }}
        cursor="pointer"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        {...flexProps}
      >
        <Text
          wordBreak="break-all"
          variant="body2"
          color="primary.main"
          transition="all 0.25s ease-in-out"
          display="inline"
          fontFamily="mono"
        >
          {value === address ? `${textValue} (Me)` : textValue}
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
