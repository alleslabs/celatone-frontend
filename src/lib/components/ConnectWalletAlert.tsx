import {
  Alert,
  AlertTitle,
  AlertDescription,
  Flex,
  Box,
  Button,
} from "@chakra-ui/react";
import type { AlertProps } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { useTrack } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";

import { CustomIcon } from "./icon";

interface ConnectWalletAlertProps extends AlertProps {
  title?: string;
  subtitle?: string;
}

export const ConnectWalletAlert = ({
  title,
  subtitle,
  ...alertProps
}: ConnectWalletAlertProps) => {
  const { address, connect } = useCurrentChain();
  const { trackUseClickWallet } = useTrack();

  const onClickConnect: MouseEventHandler = async (e) => {
    trackUseClickWallet("alert");
    e.preventDefault();
    await connect();
  };

  return !address ? (
    <Alert
      {...alertProps}
      variant="accent"
      alignItems="center"
      justifyContent="space-between"
      py={3}
    >
      <Flex gap={2}>
        <CustomIcon name="wallet-solid" boxSize={4} />
        <Box>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{subtitle}</AlertDescription>
        </Box>
      </Flex>
      <Button size="sm" variant="ghost-accent" gap={2} onClick={onClickConnect}>
        <CustomIcon name="connect" /> Connect Wallet
      </Button>
    </Alert>
  ) : null;
};
