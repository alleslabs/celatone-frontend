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
import ActionPageContainer from "lib/components/ActionPageContainer";
import { ButtonCard } from "lib/components/ButtonCard";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { CelatoneSeo } from "lib/components/Seo";
import { Stepper } from "lib/components/stepper";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useUploadAccessParamsLcd } from "lib/services/wasm/code";

const getAlertContent = (
  enabled: boolean,
  chainPrettyName: string
): {
  description: string;
  icon: JSX.Element;
  variant: AlertProps["variant"];
} =>
  enabled
    ? {
        description: "Your address is allowed to directly upload Wasm files",
        icon: (
          <CustomIcon
            name="check-circle-solid"
            boxSize={4}
            color="success.main"
          />
        ),
        variant: "success",
      }
    : {
        description: `${chainPrettyName} is a permissioned CosmWasm network. Only whitelisted addresses can directly upload Wasm files.`,
        icon: (
          <CustomIcon name="info-circle" boxSize={4} color="primary.light" />
        ),
        variant: "primary",
      };

const Deploy = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { address } = useCurrentChain();
  const {
    chainConfig: { prettyName: chainPrettyName },
  } = useCelatoneApp();
  const { data, isFetching } = useUploadAccessParamsLcd();

  const enableUpload =
    !data?.isPermissionedNetwork ||
    Boolean(address && data?.addresses?.includes(address));

  useWasmConfig({ shouldRedirect: true });

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_DEPLOY);
  }, [router.isReady]);

  if (isFetching) return <Loading />;

  const { description, icon, variant } = getAlertContent(
    enableUpload,
    chainPrettyName
  );
  return (
    <ActionPageContainer>
      <CelatoneSeo pageName="Deploy Contract" />
      <Text mb={3} variant="body1" color="text.dark" fontWeight={700}>
        DEPLOY NEW CONTRACT
      </Text>
      <Stepper currentStep={1} mode="deploy" />
      <Flex alignItems="center" my={12} direction="column">
        <Heading as="h5" variant="h5">
          Select Deploy Option
        </Heading>
        <UserDocsLink
          cta="Read more about Deploy Contract"
          mt={2}
          isDevTool
          href="cosmwasm/upload-instantiate"
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
        disabled={!enableUpload || !address}
        mb={4}
        title="Upload new WASM File"
        description={
          data?.isPermissionedNetwork
            ? "Available for whitelisted addresses only"
            : "Store a new Wasm file on-chain"
        }
        onClick={() => navigate({ pathname: "/upload" })}
      />
      <ButtonCard
        title="Use existing Code IDs"
        description="Input code ID or select from previously stored or saved codes"
        onClick={() => navigate({ pathname: "/instantiate" })}
      />
    </ActionPageContainer>
  );
};

export default Deploy;
