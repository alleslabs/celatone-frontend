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
import { useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";

import { useCelatoneApp } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { CustomIcon } from "lib/components/icon";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { EvmContractVerifyForm } from "lib/services/types";
import { useRouter } from "next/router";

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
            name="check-circle-solid"
            color="success.main"
            boxSize={14}
          />
          <Heading variant="h5">Submitted Verification!</Heading>
        </Stack>
      </ModalHeader>
      <ModalBody overflow="overlay">
        <Stack rounded={8} border="1px" borderColor="gray.700" p={4}>
          <Grid gridTemplateColumns="160px 1fr" rowGap={2}>
            <Text variant="body2" fontWeight={500} color="text.dark">
              Network
            </Text>
            <Text variant="body2">{currentChainId}</Text>
            <Text variant="body2" fontWeight={500} color="text.dark">
              Contract Address
            </Text>
            <ExplorerLink
              type="evm_contract_address"
              value={contractAddress}
              textFormat="normal"
              showCopyOnHover
            />
          </Grid>
        </Stack>
      </ModalBody>
      <ModalFooter pb={0} gap={4} display="grid" gridTemplateColumns="1fr 1fr">
        <Button variant="outline-primary" onClick={router.reload}>
          Verify More
        </Button>
        <AppLink href={`/evm-contracts/${contractAddress}`}>
          <Button variant="primary" w="full">
            See Contract Details
          </Button>
        </AppLink>
      </ModalFooter>
    </>
  );
};
