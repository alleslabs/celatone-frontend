import type { TextProps } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { Text } from "@chakra-ui/react";
import { useCurrentChain } from "lib/app-provider";

interface AssignMeProps {
  onClick?: MouseEventHandler<HTMLParagraphElement>;
  isDisable?: boolean;
  textAlign?: TextProps["textAlign"];
}

export const AssignMe = ({
  isDisable = false,
  onClick,
  textAlign = "right",
}: AssignMeProps) => {
  const { address: walletAddress } = useCurrentChain();
  const enabled = Boolean(!isDisable && walletAddress);

  return (
    <Text
      color={enabled ? "primary.main" : "gray.600"}
      cursor={enabled ? "pointer" : "not-allowed"}
      fontWeight={700}
      minW={16}
      mr={3}
      textAlign={textAlign}
      variant="body3"
      onClick={enabled ? onClick : undefined}
    >
      Assign me
    </Text>
  );
};
