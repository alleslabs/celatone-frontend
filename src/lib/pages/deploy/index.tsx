import type { AlertProps } from "@chakra-ui/react";

import { Alert, AlertDescription, Flex, Heading, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useCurrentChain,
  useInternalNavigate,
  useWasmConfig,
} from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { ButtonCard } from "lib/components/ButtonCard";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { CelatoneSeo } from "lib/components/Seo";
import { Stepper } from "lib/components/stepper";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useUploadAccessParamsRest } from "lib/services/wasm/code";
import { useRouter } from "next/router";
import { useEffect } from "react";

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
            boxSize={4}
            color="success.main"
            name="check-circle-solid"
          />
        ),
        description: "Your address is allowed to directly upload Wasm files",
      }
    : {
        variant: "primary",
        icon: (
          <CustomIcon boxSize={4} color="primary.light" name="info-circle" />
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
  const { data, isFetching } = useUploadAccessParamsRest();

  const enableUpload =
    !data?.isPermissionedNetwork ||
    Boolean(address && data?.codeUploadAccess.addresses?.includes(address));

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
    <ActionPageContainer>
      <CelatoneSeo pageName="Deploy contract" />
      <Text color="text.dark" fontWeight={700} mb={3} variant="body1">
        DEPLOY NEW CONTRACT
      </Text>
      <Stepper currentStep={1} mode="deploy" />
      <Flex alignItems="center" direction="column" my={12}>
        <Heading as="h5" variant="h5">
          Select deploy option
        </Heading>
        <UserDocsLink
          cta="Read more about Deploy Contract"
          href="cosmwasm/upload-instantiate"
          isDevTool
          mt={2}
        />
      </Flex>
      <ConnectWalletAlert
        mb={4}
        subtitle="You need to connect wallet to proceed this action"
      />
      {address && data?.isPermissionedNetwork && (
        <Alert alignItems="flex-start" gap={2} mb={4} variant={variant}>
          {icon}
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      )}
      <ButtonCard
        description={
          data?.isPermissionedNetwork
            ? "Available for whitelisted addresses only"
            : "Store a new Wasm file on-chain"
        }
        disabled={!enableUpload || !address}
        mb={4}
        title="Upload new Wasm file"
        title="Upload new WASM File"
        onClick={() => navigate({ pathname: "/upload" })}
      />
      <ButtonCard
        description="Input code ID or select from previously stored or saved codes"
        title="Use existing code IDs"
        title="Use existing Code IDs"
        onClick={() => navigate({ pathname: "/instantiate" })}
      />
    </ActionPageContainer>
  );
};

export default Deploy;
