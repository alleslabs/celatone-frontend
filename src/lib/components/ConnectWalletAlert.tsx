import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Box,
  Button,
  Icon,
  Text,
} from "@chakra-ui/react";
import type { AlertProps } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { MouseEventHandler } from "react";
import { MdLink } from "react-icons/md";

import { AmpEvent, AmpTrack } from "lib/services/amplitude";

interface ConnectWalletAlertProps extends AlertProps {
  title?: string;
  subtitle?: string;
}

export const ConnectWalletAlert = ({
  title,
  subtitle,
  ...alertProps
}: ConnectWalletAlertProps) => {
  const { address, connect } = useWallet();

  const onClickConnect: MouseEventHandler = async (e) => {
    AmpTrack(AmpEvent.USE_CLICK_WALLET);
    e.preventDefault();
    await connect();
  };

  return !address ? (
    <Alert
      {...alertProps}
      variant="honeydew"
      alignItems="center"
      justifyContent="space-between"
      py="12px"
    >
      <Flex>
        <AlertIcon />
        <Box>
          <AlertTitle>
            <Text variant="body1" fontWeight="600" color="honeydew.main">
              {title}
            </Text>
          </AlertTitle>
          <AlertDescription>
            <Text variant="body2" color="honeydew.main">
              {subtitle}
            </Text>
          </AlertDescription>
        </Box>
      </Flex>
      <Button variant="ghost-info" gap={2} onClick={onClickConnect}>
        <Icon as={MdLink} boxSize={4} />
        <Text color="honeydew.main">Connect Wallet</Text>
      </Button>
    </Alert>
  ) : null;
};
