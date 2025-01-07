import { Text } from "@chakra-ui/react";
import type { TextProps } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { useCurrentChain } from "lib/app-provider";

interface AssignMeProps {
  isDisable?: boolean;
  onClick?: MouseEventHandler<HTMLParagraphElement>;
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
      minW={16}
      mr={3}
      textAlign={textAlign}
      variant="body3"
      color={enabled ? "primary.main" : "gray.600"}
      cursor={enabled ? "pointer" : "not-allowed"}
      fontWeight={700}
      onClick={enabled ? onClick : undefined}
    >
      Assign me
    </Text>
  );
};
