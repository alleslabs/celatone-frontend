import type { AlertProps } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Flex,
} from "@chakra-ui/react";
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
      justifyContent="space-between"
      py={3}
      variant="primary"
    >
      <Flex gap={2}>
        <CustomIcon boxSize={4} name="wallet-solid" />
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
        <CustomIcon name="connect" /> Connect wallet
      </Button>
    </Alert>
  ) : null;
};
