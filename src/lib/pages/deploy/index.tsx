import {
  Alert,
  AlertDescription,
  AlertIcon,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

import {
  useCurrentNetwork,
  useInternalNavigate,
  useSelectChain,
} from "lib/app-provider";
import { ButtonCard } from "lib/components/ButtonCard";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { getChainNameByNetwork } from "lib/data";

const Deploy = () => {
  const network = useCurrentNetwork();
  const navigate = useInternalNavigate();
  const selectChain = useSelectChain();

  const isMainnet = network === "mainnet";
  return (
    <WasmPageContainer>
      <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
        DEPLOY NEW CONTRACT
      </Text>
      <Stepper mode="deploy" currentStep={1} />
      <Heading as="h4" variant="h4" my="48px">
        Select Deploy Option
      </Heading>
      {isMainnet && (
        <Alert variant="violet" mb="16px" alignItems="flex-start">
          <AlertIcon mt={2} />
          <AlertDescription>
            Uploading new Wasm files on permissioned chains is coming soon to
            Celatone. Currently, you can upload codes and instantiate contracts
            without permission on testnet.
          </AlertDescription>
        </Alert>
      )}
      <ButtonCard
        title="Upload new WASM File"
        description={
          isMainnet ? (
            <Flex fontSize="14px" gap={1}>
              <Text color="text.disabled">
                Currently available on testnet only.
              </Text>
              <Text
                color="honeydew.main"
                _hover={{ textDecoration: "underline" }}
                cursor="pointer"
                onClick={() => selectChain(getChainNameByNetwork("testnet"))}
              >
                Switch to testnet
              </Text>
            </Flex>
          ) : (
            "Store a new Wasm file on-chain"
          )
        }
        disabled={isMainnet}
        onClick={() => navigate({ pathname: "/upload" })}
        mb="16px"
      />
      <ButtonCard
        title="Use existing Code IDs"
        description="Input code ID or select from previously stored codes or your saved codes"
        onClick={() => navigate({ pathname: "/instantiate" })}
      />
    </WasmPageContainer>
  );
};

export default Deploy;
