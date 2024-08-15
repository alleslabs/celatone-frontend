import { Text } from "@chakra-ui/react";
import type { TextProps } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { useCurrentChain } from "lib/app-provider";

interface AssignMeProps {
  onClick?: MouseEventHandler<HTMLParagraphElement>;
  isDisable?: boolean;
  textAlign?: TextProps["textAlign"];
}

export const AssignMe = ({
  onClick,
  isDisable = false,
  textAlign = "right",
}: AssignMeProps) => {
  const { address: walletAddress } = useCurrentChain();
  const enabled = Boolean(!isDisable && walletAddress);

  return (
    <Text
      textAlign={textAlign}
      mr={3}
      color={enabled ? "primary.main" : "gray.600"}
      fontWeight={700}
      variant="body3"
      cursor={enabled ? "pointer" : "not-allowed"}
      minW={16}
      onClick={enabled ? onClick : undefined}
    >
      Assign me
    </Text>
  );
};
