import type { FlexProps } from "@chakra-ui/react";

import { Flex, Tag, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { type ReactNode, useRef, useState } from "react";

interface DecodeMessageHeaderProps extends FlexProps {
  children: ReactNode;
  compact: boolean;
  isExpand: boolean;
  isIbc: boolean;
  isOpinit: boolean;
  isSingleMsg: boolean;
  label: string;
  msgCount: number;
  onClick?: () => void;
  type: string;
}

export const DecodeMessageHeader = ({
  children,
  compact,
  isExpand,
  isIbc,
  isOpinit,
  isSingleMsg,
  label,
  msgCount,
  onClick,
  type,
  ...props
}: DecodeMessageHeaderProps) => {
  const isMobile = useMobile();
  const [isHoverText, setIsHoverText] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isHoverOverflowContent =
    isHoverText && !isMobile && ref.current
      ? ref.current.scrollWidth > ref.current.clientWidth
      : false;

  const isInteractive = !!onClick;

  return (
    <Flex
      _after={
        compact || !isInteractive
          ? {}
          : {
              bg: "gray.700",
              bottom: 0,
              content: '""',
              h: "1px",
              left: "50%",
              position: "absolute",
              transform: "translateX(-50%)",
              w: "99%",
            }
      }
      _hover={compact || !isInteractive ? {} : { backgroundColor: "gray.800" }}
      align="center"
      background={isHoverOverflowContent ? "gray.800" : "transparent"}
      borderRadius={compact && !isHoverOverflowContent ? "0px" : "8px"}
      cursor="pointer"
      justify="space-between"
      marginTop={isHoverOverflowContent ? "-30px" : "0px"}
      overflow={compact && !isHoverOverflowContent ? "hidden" : "visible"}
      p={compact ? (isHoverOverflowContent ? "12px" : "") : "16px 8px"}
      position={isHoverOverflowContent ? "absolute" : "relative"}
      transition={isHoverOverflowContent ? "" : "background 0.25s ease-in-out"}
      width={
        isHoverOverflowContent && ref.current
          ? ref.current.clientWidth
          : compact
            ? "100%"
            : "auto"
      }
      zIndex={isHoverOverflowContent ? 1 : "auto"}
      onClick={() => {
        if (!isInteractive) return;
        track(AmpEvent.USE_TX_MSG_EXPAND, {
          action: isExpand ? "collapse" : "expand",
          ibc: isIbc,
          isSingleMsg,
          msg: type,
        });
        onClick();
      }}
      onMouseOut={() => setIsHoverText(false)}
      onMouseOver={() => setIsHoverText(true)}
      ref={ref}
    >
      <Flex
        align="center"
        flexWrap={
          compact && !isHoverOverflowContent && !isMobile ? "nowrap" : "wrap"
        }
        {...props}
      >
        <Tag gap={0.5} minWidth="auto" py={0} variant="gray">
          <Text variant="body2" whiteSpace="nowrap">
            {label}
          </Text>
        </Tag>
        {!compact || msgCount === 1 ? (
          children
        ) : (
          <Tag gap={0.5} minWidth="auto" variant="gray">
            <Text variant="body2">{msgCount}</Text>
          </Tag>
        )}
        {isIbc && (
          <Tag minW="hug-content" size="md" variant="secondary">
            IBC
          </Tag>
        )}
        {isOpinit && (
          <Tag minW="hug-content" size="md" variant="teal">
            OPInit
          </Tag>
        )}
      </Flex>
      {!compact && isInteractive && (
        <CustomIcon
          boxSize={4}
          color="gray.600"
          m={0}
          name="chevron-down"
          transform={isExpand ? "rotate(180deg)" : "rotate(0)"}
          transition="all 0.25s ease-in-out"
        />
      )}
    </Flex>
  );
};
