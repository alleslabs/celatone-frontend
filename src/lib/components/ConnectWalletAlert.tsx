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
  title?: string;
  subtitle?: string;
}

export const ConnectWalletAlert = ({
  title,
  subtitle,
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
      variant="primary"
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
      <Button
        size="sm"
        variant="ghost-primary"
        gap={2}
        onClick={onClickConnect}
      >
        <CustomIcon name="connect" /> Connect wallet
      </Button>
    </Alert>
  ) : null;
};
