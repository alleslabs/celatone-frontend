import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useEvmConfig, useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { EmptyState } from "lib/components/state/EmptyState";
import { useEvmParams } from "lib/services/evm";
import { useCosmosTxDataByEvmTxHash, useTxDataJsonRpc } from "lib/services/tx";
import { truncate } from "lib/utils";

import {
  EvmTxDetail,
  EvmTxHeader,
  EvmTxInfo,
  EvmTxInfoMobile,
} from "./components";
import { zEvmTxDetailsQueryParams } from "./types";

interface EvmTxDetailsBodyProps {
  evmTxHash: string;
}

const EvmTxDetailsBody = ({ evmTxHash }: EvmTxDetailsBodyProps) => {
  useEvmConfig({ shouldRedirect: true });
  const router = useRouter();
  const isMobile = useMobile();
  const { data: evmParams, isLoading: isEvmParamsLoading } = useEvmParams();
  const { data: evmTxData, isLoading: isLoadingEvmTxData } =
    useTxDataJsonRpc(evmTxHash);
  const { data: cosmosTxData, isLoading: isLoadingCosmosTxData } =
    useCosmosTxDataByEvmTxHash(evmTxHash);

  const isLoading =
    isLoadingEvmTxData || isLoadingCosmosTxData || isEvmParamsLoading;

  useEffect(() => {
    if (router.isReady && !isLoading) {
      const mapTxFailed = {
        true: "success",
        false: "fail",
        undefined: "not_found",
      };
      track(AmpEvent.TO_EVM_TRANSACTION_DETAILS, {
        tx_status:
          mapTxFailed[
            String(evmTxData?.txReceipt.status) as keyof typeof mapTxFailed
          ],
      });
    }
  }, [router.isReady, evmTxData, isLoading]);

  if (isLoading || !evmTxHash) return <Loading withBorder />;

  return (
    <>
      <CelatoneSeo pageName={`EVM TxHash – ${truncate(evmTxData?.tx.hash)}`} />
      {evmTxData && cosmosTxData ? (
        <>
          <EvmTxHeader evmTxData={evmTxData} cosmosTxData={cosmosTxData} />
          {isMobile && (
            <EvmTxInfoMobile
              evmTxData={evmTxData}
              cosmosTxData={cosmosTxData}
              evmDenom={evmParams?.params.fee_denom}
            />
          )}
          <Flex my={{ base: 0, md: 12 }} gap={4} justify="space-between">
            {!isMobile && (
              <EvmTxInfo
                evmTxData={evmTxData}
                cosmosTxData={cosmosTxData}
                evmDenom={evmParams?.params.fee_denom}
              />
            )}
            <EvmTxDetail evmTxData={evmTxData} cosmosTxData={cosmosTxData} />
          </Flex>
        </>
      ) : (
        <EmptyState
          imageVariant="not-found"
          heading="Transaction does not exist"
          message="Please check your input or make sure you have selected the correct network."
        />
      )}
    </>
  );
};

const EvmTxDetails = () => {
  const router = useRouter();
  const validated = zEvmTxDetailsQueryParams.safeParse(router.query);

  return (
    <PageContainer>
      {!validated.success ? (
        <EmptyState
          imageVariant="error"
          heading="Invalid transaction hash"
          message="Invalid hex string format. Must start with 0x and have length 66."
        />
      ) : (
        <EvmTxDetailsBody evmTxHash={validated.data.txHash} />
      )}
    </PageContainer>
  );
};

export default EvmTxDetails;
