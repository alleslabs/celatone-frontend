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
    borderBottomWidth="1px"
    borderColor="gray.700"
    borderTopWidth="1px"
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
