import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useEvmConfig, useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { EmptyState } from "lib/components/state/EmptyState";
import type { Option } from "lib/types";
import { truncate } from "lib/utils";

import {
  EvmTxHeader,
  EvmTxInfo,
  EvmTxInfoMobile,
  EvmTxMsgDetails,
} from "./components";
import { useEvmTxDetailsData } from "./data";
import { zEvmTxDetailsQueryParams } from "./types";

const mapEvmTxStatus = (status: Option<boolean>) => {
  switch (status) {
    case false:
      return "failed";
    case true:
      return "success";
    default:
      return "not-found";
  }
};

interface EvmTxDetailsBodyProps {
  evmTxHash: string;
}

const EvmTxDetailsBody = ({ evmTxHash }: EvmTxDetailsBodyProps) => {
  useEvmConfig({ shouldRedirect: true });
  const router = useRouter();
  const isMobile = useMobile();
  const { cosmosTxData, evmDenom, evmTxData, evmTxValue, gasInfo, isLoading } =
    useEvmTxDetailsData(evmTxHash);

  useEffect(() => {
    if (router.isReady && !isLoading)
      track(AmpEvent.TO_EVM_TRANSACTION_DETAILS, {
        tx_status: mapEvmTxStatus(evmTxData?.txReceipt.status),
      });
  }, [router.isReady, isLoading, evmTxData?.txReceipt.status]);

  if (isLoading || !evmTxHash) return <Loading withBorder />;

  return (
    <>
      <CelatoneSeo pageName={`EVM TxHash – ${truncate(evmTxData?.tx.hash)}`} />
      {evmTxData && cosmosTxData && evmTxValue && gasInfo ? (
        <>
          <EvmTxHeader evmTxData={evmTxData} cosmosTxData={cosmosTxData} />
          {isMobile && (
            <EvmTxInfoMobile
              evmTxData={evmTxData}
              evmTxValue={evmTxValue}
              cosmosTxData={cosmosTxData}
              gasInfo={gasInfo}
            />
          )}
          <Flex gap={4} justify="space-between" my={{ base: 0, md: 12 }}>
            {!isMobile && (
              <EvmTxInfo
                evmTxData={evmTxData}
                evmTxValue={evmTxValue}
                cosmosTxData={cosmosTxData}
                gasInfo={gasInfo}
              />
            )}
            <EvmTxMsgDetails
              evmTxData={evmTxData}
              cosmosTxData={cosmosTxData}
              evmDenom={evmDenom}
            />
          </Flex>
        </>
      ) : (
        <EmptyState
          heading="Transaction does not exist"
          imageVariant="not-found"
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
          heading="Invalid transaction hash"
          imageVariant="error"
          message="Invalid hex string format. Must start with 0x and have length 66."
        />
      ) : (
        <EvmTxDetailsBody evmTxHash={validated.data.txHash} />
      )}
    </PageContainer>
  );
};

export default EvmTxDetails;
