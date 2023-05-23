import type { AlertProps } from "@chakra-ui/react";
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
import { useEffect, useMemo } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { ButtonCard } from "lib/components/ButtonCard";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { useUploadAccessParams } from "lib/services/proposalService";
import type { HumanAddr } from "lib/types";
import { AccessConfigPermission } from "lib/types";

const getAlertContent = (
  enabled: boolean
): { variant: AlertProps["variant"]; icon: JSX.Element; description: string } =>
  enabled
    ? {
        variant: "success",
        icon: (
          <CustomIcon
            name="check-circle-solid"
            color="success.main"
            boxSize={4}
          />
        ),
        description: "Your address is allowed to directly upload Wasm files",
      }
    : {
        variant: "primary",
        icon: (
          <CustomIcon
            name="info-circle-solid"
            color="primary.light"
            boxSize={4}
          />
        ),
        description:
          "The current network is a permissioned CosmWasm network. Only whitelisted addresses can directly upload Wasm files.",
      };

const Deploy = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { address } = useWallet();
  const { data, isFetching } = useUploadAccessParams();

  const isPermissionedNetwork =
    data?.permission !== AccessConfigPermission.EVERYBODY;

  const enableUpload = useMemo(() => {
    if (!isPermissionedNetwork) return true;
    return Boolean(data?.addresses?.includes(address as HumanAddr));
  }, [data, address, isPermissionedNetwork]);

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_DEPLOY);
  }, [router.isReady]);

  if (isFetching) return <Loading />;

  const { variant, icon, description } = getAlertContent(enableUpload);
  return (
    <WasmPageContainer>
      <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
        DEPLOY NEW CONTRACT
      </Text>
      <Stepper mode="deploy" currentStep={1} />
      <Heading as="h5" variant="h5" my={12}>
        Select Deploy Option
      </Heading>
      <ConnectWalletAlert
        subtitle="You need to connect wallet to proceed this action"
        mb={4}
      />
      {address && (
        <Alert variant={variant} mb={4} alignItems="flex-start" gap={2}>
          {icon}
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      )}
      <ButtonCard
        title="Upload new WASM File"
        description={
          isPermissionedNetwork
            ? "Available for whitelisted addresses only"
            : "Store a new Wasm file on-chain"
        }
        disabled={!enableUpload || !address}
        onClick={() => navigate({ pathname: "/upload" })}
        mb={4}
      />
      <ButtonCard
        title="Use existing Code IDs"
        description="Input code ID or select from previously stored or saved codes"
        onClick={() => navigate({ pathname: "/instantiate" })}
        disabled={!address}
      />
      <Flex justify="center" w="100%" mt={8}>
        <Button
          onClick={() => {
            router.back();
          }}
          variant="ghost-gray"
        >
          Cancel
        </Button>
      </Flex>
    </WasmPageContainer>
  );
};

export default Deploy;
