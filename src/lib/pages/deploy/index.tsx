import type { AlertProps } from "@chakra-ui/react";
import { Alert, AlertDescription, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useCurrentChain,
  useInternalNavigate,
  useWasmConfig,
} from "lib/app-provider";
import { ButtonCard } from "lib/components/ButtonCard";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { CelatoneSeo } from "lib/components/Seo";
import { Stepper } from "lib/components/stepper";
import { UserDocsLink } from "lib/components/UserDocsLink";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { useUploadAccessParams } from "lib/services/wasm/code";
import { AccessConfigPermission } from "lib/types";

const getAlertContent = (
  enabled: boolean,
  chainPrettyName: string
): {
  variant: AlertProps["variant"];
  icon: JSX.Element;
  description: string;
} =>
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
        description: `${chainPrettyName} is a permissioned CosmWasm network. Only whitelisted addresses can directly upload Wasm files.`,
      };

const Deploy = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { address } = useCurrentChain();
  const {
    chainConfig: { prettyName: chainPrettyName },
  } = useCelatoneApp();
  const { data, isFetching } = useUploadAccessParams();

  const isPermissionedNetwork =
    data?.permission !== AccessConfigPermission.EVERYBODY;

  const enableUpload =
    !isPermissionedNetwork ||
    Boolean(address && data?.addresses?.includes(address));

  useWasmConfig({ shouldRedirect: true });

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_DEPLOY);
  }, [router.isReady]);

  if (isFetching) return <Loading />;

  const { variant, icon, description } = getAlertContent(
    enableUpload,
    chainPrettyName
  );
  return (
    <WasmPageContainer>
      <CelatoneSeo pageName="Deploy Contract" />
      <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
        DEPLOY NEW CONTRACT
      </Text>
      <Stepper mode="deploy" currentStep={1} />
      <Flex direction="column" alignItems="center" my={12}>
        <Heading as="h5" variant="h5">
          Select Deploy Option
        </Heading>
        <UserDocsLink
          isDevTool
          mt={2}
          cta="Read more about Deploy Contract"
          href="cosmwasm/upload-instantiate"
        />
      </Flex>
      <ConnectWalletAlert
        subtitle="You need to connect wallet to proceed this action"
        mb={4}
      />
      {address && isPermissionedNetwork && (
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
      />
    </WasmPageContainer>
  );
};

export default Deploy;
