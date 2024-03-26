import { Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import type { StoreCodeSucceedCallback } from "lib/app-fns/tx/storeCode";
import { useCurrentChain, useInternalNavigate } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { Stepper } from "lib/components/stepper";
import { UploadSection } from "lib/components/upload/UploadSection";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { useUploadAccessParams } from "lib/services/proposalService";
import { AccessConfigPermission } from "lib/types";

export const Upload = ({
  onComplete,
}: {
  onComplete: StoreCodeSucceedCallback;
}) => {
  const router = useRouter();
  const { address } = useCurrentChain();
  const navigate = useInternalNavigate();
  const { data, isLoading } = useUploadAccessParams();

  const isPermissionedNetwork =
    data?.permission !== AccessConfigPermission.EVERYBODY;

  const enableUpload =
    !isPermissionedNetwork ||
    (address && Boolean(data?.addresses?.includes(address)));

  useEffect(() => {
    // Redirect back to deploy page
    if (!enableUpload && !isLoading)
      navigate({ pathname: "/deploy", replace: true });
    else if (router.isReady) track(AmpEvent.TO_UPLOAD);
  }, [enableUpload, isLoading, navigate, router.isReady]);

  return (
    <>
      <WasmPageContainer flexProps={{ py: 0, pt: 12, minH: "auto" }}>
        <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
          DEPLOY NEW CONTRACT
        </Text>
        <Stepper mode="deploy" currentStep={1} />
        <Heading as="h5" variant="h5" my={12}>
          Upload Wasm file
        </Heading>
        <ConnectWalletAlert
          subtitle="You need to connect your wallet first"
          mb={12}
        />
      </WasmPageContainer>
      <UploadSection handleBack={router.back} onComplete={onComplete} />
    </>
  );
};
