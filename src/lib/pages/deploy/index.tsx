import {
  Alert,
  AlertDescription,
  Flex,
  Heading,
  Button,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useInternalNavigate, useWasmConfig } from "lib/app-provider";
import { ButtonCard } from "lib/components/ButtonCard";
import { CustomIcon } from "lib/components/icon";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { useGovParams } from "lib/services/proposalService";
import type { HumanAddr } from "lib/types";
import { AccessConfigPermission } from "lib/types";
import { resolvePermission } from "lib/utils";

const Deploy = () => {
  const { address } = useWallet();
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { data: govParams } = useGovParams();
  const isAllowed = resolvePermission(
    address as HumanAddr,
    govParams?.uploadAccess.permission,
    govParams?.uploadAccess.addresses
  );

  useWasmConfig({ shouldRedirect: true });

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_DEPLOY);
  }, [router.isReady]);

  return (
    <WasmPageContainer>
      <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
        DEPLOY NEW CONTRACT
      </Text>
      <Stepper mode="deploy" currentStep={1} />
      <Heading as="h5" variant="h5" my="48px">
        Select Deploy Option
      </Heading>
      {govParams?.uploadAccess.permission !==
        AccessConfigPermission.EVERYBODY &&
        (isAllowed ? (
          <Alert variant="success" mb="16px" alignItems="center" gap={3}>
            <CustomIcon
              name="check-circle-solid"
              color="success.main"
              boxSize="16px"
            />
            <AlertDescription>
              Your address is included in the whitelist to upload Wasm file.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="violet" mb="16px" alignItems="center" gap={3}>
            <CustomIcon
              name="info-circle"
              color="violet.light"
              boxSize="16px"
            />
            <AlertDescription>
              Your selected network is a permissioned chain. Only addresses
              included in the whitelist are able to upload a new Wasm file.
            </AlertDescription>
          </Alert>
        ))}
      <ButtonCard
        title="Upload new WASM File"
        description={
          !isAllowed ? (
            <Flex fontSize="14px" gap={1}>
              <Text color="text.disabled">
                Available for whitelisted addresses only.
              </Text>
              <Text
                color="honeydew.main"
                _hover={{ textDecoration: "underline" }}
                cursor="pointer"
                onClick={() => navigate({ pathname: "/proposal/whitelist" })}
              >
                Propose to whitelist
              </Text>
            </Flex>
          ) : (
            "Store a new Wasm file on-chain"
          )
        }
        disabled={!isAllowed}
        onClick={() => navigate({ pathname: "/upload" })}
        mb="16px"
      />
      <ButtonCard
        title="Use existing Code IDs"
        description="Input code ID or select from previously stored or saved codes"
        onClick={() => navigate({ pathname: "/instantiate" })}
      />
      <Flex justify="center" w="100%" mt="32px">
        <Button
          onClick={() => {
            router.back();
          }}
          size="md"
          variant="ghost-gray"
        >
          Cancel
        </Button>
      </Flex>
    </WasmPageContainer>
  );
};

export default Deploy;
