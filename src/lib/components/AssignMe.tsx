import { Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { MouseEventHandler } from "react";

interface AssginMeProps {
  onClick?: MouseEventHandler<HTMLParagraphElement>;
  isDisable?: boolean;
}

export const AssignMe = ({ onClick, isDisable = false }: AssginMeProps) => {
  const { address: walletAddress = "" } = useWallet();
  return (
    <Text
      textAlign="right"
      mr={3}
      color={!isDisable && walletAddress ? "honeydew.main" : "pebble.500"}
      fontWeight="600"
      variant="body3"
      cursor={!isDisable && walletAddress ? "pointer" : "not-allowed"}
      minW={16}
      onClick={onClick}
    >
      Assign me
    </Text>
  );
};
