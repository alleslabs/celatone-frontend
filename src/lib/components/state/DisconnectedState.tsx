import { Flex, Text } from "@chakra-ui/react";

import { ConnectWalletBtn } from "../button/ConnectWallet";
import { StateImage } from "./StateImage";

interface DisconnectedStateProps {
  text: string;
  helperText?: string;
}

export const DisconnectedState = ({
  text,
  helperText,
}: DisconnectedStateProps) => (
  <Flex
    alignItems="center"
    borderColor="gray.700"
    borderY="1px solid"
    direction="column"
    gap={4}
    py={12}
  >
    <StateImage imageVariant="disconnected" />
    <Flex align="center" justify="center">
      <ConnectWalletBtn />
      <Text color="text.dark" ml={2} variant="body1">
        {text}
      </Text>
    </Flex>
    {helperText && (
      <Text
        alignSelf="center"
        color="text.dark"
        maxW="520px"
        mt={4}
        textAlign="center"
        variant="body1"
      >
        {helperText}
      </Text>
    )}
  </Flex>
);
