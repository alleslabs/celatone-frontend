import { Flex, Text } from "@chakra-ui/react";

import { ConnectWalletBtn } from "../button/ConnectWallet";

interface DisconnectedStateProps {
  text: string;
  helperText?: string;
}

export const DisconnectedState = ({
  text,
  helperText,
}: DisconnectedStateProps) => {
  return (
    <>
      <Flex align="center" justify="center">
        <ConnectWalletBtn />
        <Text variant="body1" color="text.dark" ml="10px">
          {text}
        </Text>
      </Flex>
      {helperText && (
        <Text
          variant="body1"
          color="text.dark"
          textAlign="center"
          mt="16px"
          mx="96px"
        >
          {helperText}
        </Text>
      )}
    </>
  );
};
