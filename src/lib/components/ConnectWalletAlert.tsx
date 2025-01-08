import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Flex,
} from "@chakra-ui/react";
import type { AlertProps } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { trackUseClickWallet } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";

import { CustomIcon } from "./icon";

interface ConnectWalletAlertProps extends AlertProps {
  subtitle?: string;
  title?: string;
}

export const ConnectWalletAlert = ({
  subtitle,
  title,
  ...alertProps
}: ConnectWalletAlertProps) => {
  const { address, connect } = useCurrentChain();

  const onClickConnect: MouseEventHandler = async (e) => {
    trackUseClickWallet("alert");
    e.preventDefault();
    await connect();
  };

  return !address ? (
    <Alert
      {...alertProps}
      alignItems="center"
      py={3}
      variant="primary"
      justifyContent="space-between"
    >
      <Flex gap={2}>
        <CustomIcon name="wallet-solid" boxSize={4} />
        <Box>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{subtitle}</AlertDescription>
        </Box>
      </Flex>
      <Button
        gap={2}
        size="sm"
        variant="ghost-primary"
        onClick={onClickConnect}
      >
        <CustomIcon name="connect" /> Connect Wallet
      </Button>
    </Alert>
  ) : null;
};
