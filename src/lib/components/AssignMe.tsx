import { Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { MouseEventHandler } from "react";

interface AssginMeProps {
  onClick?: MouseEventHandler<HTMLParagraphElement>;
  isDisable?: boolean;
}

export const AssignMe = ({ onClick, isDisable = false }: AssginMeProps) => {
  const { address: walletAddress } = useWallet();
  const enabled = Boolean(!isDisable && walletAddress);
  return (
    <Text
      textAlign="right"
      mr={3}
      color={enabled ? "accent.main" : "gray.500"}
      fontWeight="600"
      variant="body3"
      cursor={enabled ? "pointer" : "not-allowed"}
      minW={16}
      onClick={enabled ? onClick : undefined}
    >
      Assign me
    </Text>
  );
};
