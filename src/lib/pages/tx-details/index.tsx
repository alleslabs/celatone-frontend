import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useEvmConfig, useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { EmptyState, InvalidState } from "lib/components/state";
import { useEvmTxHashByCosmosTxHash, useTxData } from "lib/services/tx";
import type { Option } from "lib/types";
import { truncate } from "lib/utils";

import { TxHeader, TxInfo, TxInfoMobile } from "./components";
import { MessageSection } from "./components/MessageSection";
import { useTxRedirect } from "./hooks";
import { zTxDetailsQueryParams } from "./types";
import { useEvmParams } from "lib/services/evm";

const mapTxisFailed = (isFailed: Option<boolean>) => {
  switch (isFailed) {
    case false:
      return "success";
    case true:
      return "failed";
    default:
      return "not-found";
  }
};

const InvalidTx = () => <InvalidState title="Transaction does not exist" />;

const TxDetailsBody = ({ txHash }: { txHash: string }) => {
  const router = useRouter();
  const isMobile = useMobile();

  const isCheckingRedirect = useTxRedirect(txHash);
  const { data, isLoading } = useTxData(txHash);

  const { data: evmParams, isFetching: isEvmParamsFetching } = useEvmParams();
  const { data: relatedEvmTxHash, isFetching: isRelatedEvmTxFetching } =
    useEvmTxHashByCosmosTxHash(txHash);
  const gasRefundRatio = relatedEvmTxHash
    ? evmParams?.params.gasRefundRatio
    : undefined;

  useEffect(() => {
    if (router.isReady && !isLoading)
      track(AmpEvent.TO_TRANSACTION_DETAILS, {
        tx_status: mapTxisFailed(data?.isTxFailed),
      });
  }, [router.isReady, data, isLoading]);

  if (
    isCheckingRedirect ||
    isLoading ||
    isRelatedEvmTxFetching ||
    isEvmParamsFetching
  )
    return <Loading withBorder />;
  if (!data) return <InvalidTx />;

  return (
    <>
      <CelatoneSeo pageName={`TxHash – ${truncate(data?.txhash)}`} />
      <Breadcrumb
        items={[
          { text: "Transactions", href: "/txs" },
          { text: truncate(data?.txhash) },
        ]}
      />
      {data ? (
        <>
          <TxHeader mt={2} txData={data} />
          {isMobile && (
            <TxInfoMobile txData={data} gasRefundRatio={gasRefundRatio} />
          )}
          <Flex my={{ base: 0, md: 12 }} gap={4} justify="space-between">
            {!isMobile && (
              <TxInfo txData={data} gasRefundRatio={gasRefundRatio} />
            )}
            <MessageSection txData={data} relatedEvmTxHash={relatedEvmTxHash} />
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

const TxDetails = () => {
  const router = useRouter();
  const evm = useEvmConfig({ shouldRedirect: false });
  const validated = zTxDetailsQueryParams(evm.enabled).safeParse(router.query);

  return (
    <PageContainer>
      {validated.success ? (
        <TxDetailsBody {...validated.data} />
      ) : (
        <InvalidTx />
      )}
    </PageContainer>
  );
};

export default TxDetails;
