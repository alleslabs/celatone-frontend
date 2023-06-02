import {
  Alert,
  AlertTitle,
  AlertDescription,
  Flex,
  Box,
  Button,
} from "@chakra-ui/react";
import type { AlertProps } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { MouseEventHandler } from "react";

import { AmpTrackUseClickWallet } from "lib/services/amplitude";

import { CustomIcon } from "./icon";

interface ConnectWalletAlertProps extends AlertProps {
  title?: string;
  subtitle?: string;
  page?: string;
}

export const ConnectWalletAlert = ({
  title,
  subtitle,
  page,
  ...alertProps
}: ConnectWalletAlertProps) => {
  const { address, connect } = useWallet();

  const onClickConnect: MouseEventHandler = async (e) => {
    AmpTrackUseClickWallet(page, "alert");
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
