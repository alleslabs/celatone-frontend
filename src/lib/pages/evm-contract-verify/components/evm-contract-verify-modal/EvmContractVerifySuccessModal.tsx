import type { EvmContractVerifyForm } from "lib/types";
import type { Control } from "react-hook-form";

import {
  Button,
  Grid,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useCelatoneApp } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { useRouter } from "next/router";
import { useWatch } from "react-hook-form";

interface EvmContractVerifySuccessModalProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifySuccessModal = ({
  control,
}: EvmContractVerifySuccessModalProps) => {
  const { currentChainId } = useCelatoneApp();
  const router = useRouter();

  const contractAddress = useWatch({
    control,
    name: "contractAddress",
  });

  return (
    <>
      <ModalHeader w="full">
        <ModalCloseButton color="gray.600" />
        <Stack alignItems="center" gap={4} w="100%">
          <CustomIcon
            boxSize={14}
            color="success.main"
            name="check-circle-solid"
          />
          <Heading variant="h5">Submitted verification!</Heading>
        </Stack>
      </ModalHeader>
      <ModalBody overflow="overlay">
        <Stack border="1px" borderColor="gray.700" p={4} rounded={8}>
          <Grid gridTemplateColumns="160px 1fr" rowGap={2}>
            <Text color="text.dark" fontWeight={500} variant="body2">
              Network
            </Text>
            <Text variant="body2">{currentChainId}</Text>
            <Text color="text.dark" fontWeight={500} variant="body2">
              Contract address
            </Text>
            <ExplorerLink
              showCopyOnHover
              textFormat="normal"
              type="evm_contract_address"
              value={contractAddress}
            />
          </Grid>
        </Stack>
      </ModalBody>
      <ModalFooter display="grid" gap={4} gridTemplateColumns="1fr 1fr" pb={0}>
        <Button variant="outline-primary" onClick={router.reload}>
          Verify more
        </Button>
        <AppLink href={`/evm-contracts/${contractAddress}`}>
          <Button variant="primary" w="full">
            See contract details
          </Button>
        </AppLink>
      </ModalFooter>
    </>
  );
};
