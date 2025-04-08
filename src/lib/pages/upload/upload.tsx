import type { StoreCodeSucceedCallback } from "lib/app-fns/tx/storeCode";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCurrentChain, useInternalNavigate } from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { CustomIcon } from "lib/components/icon";
import { FooterCta } from "lib/components/layouts";
import { CelatoneSeo } from "lib/components/Seo";
import { Stepper } from "lib/components/stepper";
import { UploadSection } from "lib/components/upload";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useUploadCode } from "lib/hooks";
import { useUploadAccessParamsRest } from "lib/services/wasm/code";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const Upload = ({
  onComplete,
}: {
  onComplete: StoreCodeSucceedCallback;
}) => {
  const router = useRouter();
  const { address } = useCurrentChain();
  const navigate = useInternalNavigate();
  const { data, isLoading } = useUploadAccessParamsRest();
  const {
    proceed,
    formData,
    estimatedFee,
    setEstimatedFee,
    shouldNotSimulate,
    setDefaultBehavior,
    simulateStatus,
    isSimulating,
    isDisabledProcess,
  } = useUploadCode(onComplete, false);

  const enableUpload =
    !data?.isPermissionedNetwork ||
    (address && Boolean(data?.codeUploadAccess.addresses?.includes(address)));

  useEffect(() => {
    // Redirect back to deploy page
    if (!enableUpload && !isLoading)
      navigate({ pathname: "/deploy", replace: true });
    else if (router.isReady) track(AmpEvent.TO_UPLOAD);
  }, [enableUpload, isLoading, navigate, router.isReady]);

  return (
    <>
      <ActionPageContainer>
        <CelatoneSeo pageName="Upload Wasm file" />
        <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
          DEPLOY NEW CONTRACT
        </Text>
        <Stepper currentStep={1} mode="deploy" />
        <Flex alignItems="center" direction="column" my={12}>
          <Heading as="h5" variant="h5">
            Upload Wasm file
          </Heading>
          <UserDocsLink
            isDevTool
            mt={2}
            cta="View upload guideline"
            href="cosmwasm/upload-instantiate#upload-wasm-to-store-code"
            isDevTool
            mt={2}
          />
        </Flex>
        <ConnectWalletAlert
          mb={12}
          subtitle="You need to connect your wallet first"
        />
        <UploadSection
          estimatedFee={estimatedFee}
          formData={formData}
          isSimulating={isSimulating}
          setDefaultBehavior={setDefaultBehavior}
          setEstimatedFee={setEstimatedFee}
          shouldNotSimulate={shouldNotSimulate}
          simulateStatus={simulateStatus}
        />
      </ActionPageContainer>
      <FooterCta
        actionButton={{
          isDisabled: isDisabledProcess,
          onClick: proceed,
        }}
        actionLabel="Upload"
        cancelButton={{
          leftIcon: <CustomIcon name="chevron-left" />,
          onClick: router.back,
        }}
      />
    </>
  );
};
