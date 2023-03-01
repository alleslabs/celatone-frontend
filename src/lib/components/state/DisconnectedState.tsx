import { Flex, Text } from "@chakra-ui/react";

import { ConnectWalletBtn } from "../button/ConnectWallet";

interface DisconnectedStateProps {
  text: string;
  helperText?: string;
}

export const DisconnectedState = ({
  text,
  helperText,
}: DisconnectedStateProps) => (
  <>
    <Flex align="center" justify="center">
      <ConnectWalletBtn />
      <Text variant="body1" color="text.dark" ml="8px">
        {text}
      </Text>
    </Flex>
    {helperText && (
      <Text
        variant="body1"
        color="text.dark"
        textAlign="center"
        mt="16px"
        maxW="520px"
        alignSelf="center"
      >
        {helperText}
      </Text>
    )}
  </>
);
