import type { FlexProps } from "@chakra-ui/react";
import type { IconKeys } from "lib/components/icon";
import type { ReactNode } from "react";

import { Flex, Tag, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";

interface DecodeMessageHeaderProps extends FlexProps {
  children: ReactNode;
  iconName: IconKeys;
  isExpand: boolean;
  isIbc: boolean;
  isOpinit: boolean;
  isSingleMsg: boolean;
  label: string;
  onClick: () => void;
  type: string;
}

export const DecodeMessageHeader = ({
  children,
  iconName,
  isExpand,
  isIbc,
  isOpinit,
  isSingleMsg,
  label,
  onClick,
  type,
  ...props
}: DecodeMessageHeaderProps) => (
  <Flex
    _after={{
      bg: "gray.700",
      bottom: 0,
      content: '""',
      h: "1px",
      left: "50%",
      position: "absolute",
      transform: "translateX(-50%)",
      w: "99%",
    }}
    _hover={{ backgroundColor: "gray.800" }}
    align="center"
    borderRadius="8px"
    cursor="pointer"
    justify="space-between"
    p="16px 8px"
    position="relative"
    transition="all 0.25s ease-in-out"
    onClick={() => {
      track(AmpEvent.USE_TX_MSG_EXPAND, {
        action: isExpand ? "collapse" : "expand",
        ibc: isIbc,
        isSingleMsg,
        msg: type,
      });
      onClick();
    }}
  >
    <Flex align="center" flexWrap="wrap" {...props}>
      <Tag gap={1} variant="gray">
        <CustomIcon boxSize={3} name={iconName} />
        <Text fontWeight={700} variant="body2">
          {label}
        </Text>
      </Tag>
      {children}
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
    <CustomIcon
      boxSize={4}
      color="gray.600"
      m={0}
      name="chevron-down"
      transform={isExpand ? "rotate(180deg)" : "rotate(0)"}
      transition="all 0.25s ease-in-out"
    />
  </Flex>
);
