import type { FlexProps, IconProps } from "@chakra-ui/react";

import { Flex, Text, useClipboard } from "@chakra-ui/react";
import { trackUseCopier } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";
import { bech32AddressToHex, truncate } from "lib/utils";
import { useEffect, useMemo, useState } from "react";

import { CustomIcon } from "./icon";
import { Tooltip } from "./Tooltip";

interface CopyLinkProps extends FlexProps {
  amptrackSection?: string;
  displayTextColor?: string;
  isTruncate?: boolean;
  showCopyOnHover?: boolean;
  type: string;
  value: string;
  withoutIcon?: boolean;
}

export const CopyLink = ({
  amptrackSection,
  displayTextColor = "primary.main",
  isTruncate = false,
  showCopyOnHover = false,
  type,
  value,
  withoutIcon,
  ...flexProps
}: CopyLinkProps) => {
  const { address: accountBech } = useCurrentChain();
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

  const displayValue = useMemo(() => {
    const textValue = isTruncate ? truncate(value) : value;

    if (!accountBech) return textValue;

    const accountHex = bech32AddressToHex(accountBech);
    const isCurrentUser =
      accountBech === value || accountHex === value.toLowerCase();

    return isCurrentUser ? `${textValue} (Me)` : textValue;
  }, [accountBech, isTruncate, value]);

  return (
    <Tooltip
      closeOnClick={false}
      isOpen={isHover || hasCopied}
      label={hasCopied ? "Copied!" : "Click to copy"}
    >
      <Flex
        _hover={{
          "& > p": { color: "primary.light" },
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        }}
        align="center"
        cursor="pointer"
        display={{ base: "inline", md: "flex" }}
        w="fit-content"
        onClick={() => {
          trackUseCopier(type, amptrackSection);
          onCopy();
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        {...flexProps}
      >
        <Text
          color={displayTextColor}
          display="inline"
          fontFamily="mono"
          transition="all 0.25s ease-in-out"
          variant="body2"
          wordBreak="break-all"
        >
          {displayValue}
        </Text>
        {!withoutIcon && (
          <CustomIcon
            boxSize={3}
            color="gray.600"
            cursor="pointer"
            display={displayIcon}
            marginLeft={2}
            name="copy"
          />
        )}
      </Flex>
    </Tooltip>
  );
};
