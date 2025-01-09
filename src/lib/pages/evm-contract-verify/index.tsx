import { useEvmConfig } from "lib/app-provider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { track } from "@amplitude/analytics-browser";
import { AmpEvent } from "lib/amplitude";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { Stack } from "@chakra-ui/react";
import { EvmContractVerifyTop } from "./components/EvmContractVerifyTop";

export const EvmContractVerify = () => {
  useEvmConfig({ shouldRedirect: true });
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_EVM_CONTRACT_VERIFY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <PageContainer>
      <CelatoneSeo pageName={`EVM Contract Verify`} />
      <Stack gap={6}>
        <EvmContractVerifyTop />
      </Stack>
    </PageContainer>
  );
};
