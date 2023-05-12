import { Heading, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useCurrentNetwork, useInternalNavigate } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { Stepper } from "lib/components/stepper";
import { UploadSection } from "lib/components/upload/UploadSection";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { useGovParams } from "lib/services/proposalService";
import type { Addr } from "lib/types";

const Upload = () => {
  const router = useRouter();
  const { isMainnet } = useCurrentNetwork();

  const { address = "" } = useWallet();
  const navigate = useInternalNavigate();
  const { data: govParams } = useGovParams();
  const isAllowed = Boolean(
    govParams?.uploadAccess?.addresses?.includes(address as Addr)
  );

  useEffect(() => {
    if (!isAllowed && isMainnet) navigate({ pathname: "/deploy" });
    else if (router.isReady) AmpTrack(AmpEvent.TO_UPLOAD);
  }, [isAllowed, isMainnet, navigate, router.isReady]);

  return (
    <WasmPageContainer>
      <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
        DEPLOY NEW CONTRACT
      </Text>
      <Stepper mode="deploy" currentStep={1} />
      <Heading as="h5" variant="h5" my="48px">
        Upload Wasm file
      </Heading>
      <ConnectWalletAlert
        subtitle="You need to connect your wallet first"
        mb="48px"
      />
      <UploadSection handleBack={() => router.back()} />
    </WasmPageContainer>
  );
};

export default Upload;
