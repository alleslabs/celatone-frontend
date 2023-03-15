import { Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { Stepper } from "lib/components/stepper";
import { UploadSection } from "lib/components/upload/UploadSection";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

const Upload = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_UPLOAD);
  }, [router.isReady]);

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
