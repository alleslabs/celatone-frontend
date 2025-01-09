import { useConvertHexAddress, useEvmConfig } from "lib/app-provider";
import { zEvmContractVerifyQueryParams } from "./types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { track } from "@amplitude/analytics-browser";
import { AmpEvent } from "lib/amplitude";
import PageContainer from "lib/components/PageContainer";
import { isHexWalletAddress } from "lib/utils";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { HexAddr20 } from "lib/types";
import { useEvmCodesByAddress } from "lib/services/evm";
import { Loading } from "lib/components/Loading";
import { CelatoneSeo } from "lib/components/Seo";
import { truncate } from "lodash";
import { Stack } from "@chakra-ui/react";
import { EvmContractVerifyTop } from "./components/EvmContractVerifyTop";

const InvalidContract = () => <InvalidState title="Contract does not exist" />;

interface EvmContractVerifyBodyProps {
  contractAddress: HexAddr20;
}

const EvmContractVerifyBody = ({
  contractAddress,
}: EvmContractVerifyBodyProps) => {
  // const { convertHexWalletAddress } = useConvertHexAddress();
  // const contractAddressBechAddr = convertHexWalletAddress(contractAddress);

  const { data: evmCodesByAddressData, isLoading: isEvmCodesByAddressLoading } =
    useEvmCodesByAddress(contractAddress);

  if (isEvmCodesByAddressLoading) return <Loading />;
  if (!evmCodesByAddressData)
    return <ErrorFetching dataName="evm contract information" />;
  if (!evmCodesByAddressData.code) return <InvalidContract />;

  return (
    <>
      <CelatoneSeo pageName={`EVM Contract – ${truncate(contractAddress)}`} />
      <Stack gap={6}>
        <EvmContractVerifyTop />
      </Stack>
    </>
  );
};

export const EvmContractVerify = () => {
  // useEvmConfig({ shouldRedirect: true });
  const router = useRouter();

  const validated = zEvmContractVerifyQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_EVM_CONTRACT_VERIFY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <PageContainer>
      {!validated.success ||
      !isHexWalletAddress(validated.data.contractAddress) ? (
        <InvalidContract />
      ) : (
        <EvmContractVerifyBody {...validated.data} />
      )}
    </PageContainer>
  );
};
