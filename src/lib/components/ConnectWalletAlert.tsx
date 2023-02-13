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
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{subtitle}</AlertDescription>
        </Box>
      </Flex>
      <Button variant="ghost-info" gap={2} onClick={onClickConnect}>
        <Icon as={MdLink} boxSize={4} />
        <Text color="honeydew.main">Connect Wallet</Text>
      </Button>
    </Alert>
  ) : null;
};
