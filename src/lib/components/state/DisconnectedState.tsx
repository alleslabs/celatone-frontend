import { Flex, Text } from "@chakra-ui/react";

import { ConnectWalletBtn } from "../button/ConnectWallet";

import { StateImage } from "./StateImage";

interface DisconnectedStateProps {
  helperText?: string;
  text: string;
}

export const DisconnectedState = ({
  helperText,
  text,
}: DisconnectedStateProps) => (
  <Flex
    alignItems="center"
    gap={4}
    py={12}
    borderColor="gray.700"
    borderY="1px solid"
    direction="column"
  >
    <StateImage imageVariant="disconnected" />
    <Flex align="center" justify="center">
      <ConnectWalletBtn />
      <Text ml={2} variant="body1" color="text.dark">
        {text}
      </Text>
    </Flex>
    {helperText && (
      <Text
        alignSelf="center"
        maxW="520px"
        mt={4}
        textAlign="center"
        variant="body1"
        color="text.dark"
      >
        {helperText}
      </Text>
    )}
  </Flex>
);
