import type { PartialTxData, TxData } from "lib/services/types";
import type { Option } from "lib/types";

import { Alert, AlertDescription, Button, Flex } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useEvmConfig, useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { EmptyState, InvalidState } from "lib/components/state";
import { useEvmParams } from "lib/services/evm";
import { useEvmTxHashByCosmosTxHash, useTxDetailsData } from "lib/services/tx";
import { truncate } from "lib/utils";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { TxHeader, TxInfo, TxInfoMobile } from "./components";
import { MessageSection } from "./components/MessageSection";
import { useTxRedirect } from "./hooks";
import { zTxDetailsQueryParams } from "./types";

const mapTxStatus = (data: Option<PartialTxData | TxData>) => {
  if (!data) return "not-found";
  if (data.isPartial) return "partial";
  return data.isTxFailed ? "failed" : "success";
};

const InvalidTx = () => <InvalidState title="Transaction does not exist" />;

const TxDetailsBody = ({ txHash }: { txHash: string }) => {
  const router = useRouter();
  const isMobile = useMobile();

  const isCheckingRedirect = useTxRedirect(txHash);
  const { data, isFetching, isLoading, refetch } = useTxDetailsData(txHash);

  const { data: evmParams, isFetching: isEvmParamsFetching } = useEvmParams();
  const { data: relatedEvmTxHash, isFetching: isRelatedEvmTxFetching } =
    useEvmTxHashByCosmosTxHash(txHash);
  const gasRefundRatio =
    relatedEvmTxHash && !data?.isPartial
      ? evmParams?.params.gasRefundRatio
      : undefined;

  useEffect(() => {
    if (router.isReady && !isLoading)
      track(AmpEvent.TO_TRANSACTION_DETAILS, {
        tx_status: mapTxStatus(data),
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
          { href: "/txs", text: "Transactions" },
          { text: truncate(data?.txhash) },
        ]}
      />
      {data ? (
        <>
          <TxHeader mt={2} txData={data} />
          {data.isPartial && (
            <Alert alignItems="center" gap={3} mt={4} variant="warning">
              <CustomIcon
                boxSize={4}
                color="warning.main"
                name="alert-triangle-solid"
              />
              <AlertDescription flex={1}>
                Some details cannot be loaded. Please try again later.
              </AlertDescription>
              <Button
                isLoading={isFetching}
                size="sm"
                variant="outline-white"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </Alert>
          )}
          {isMobile && (
            <TxInfoMobile gasRefundRatio={gasRefundRatio} txData={data} />
          )}
          <Flex gap={4} justify="space-between" my={{ base: 0, md: 12 }}>
            {!isMobile && (
              <TxInfo gasRefundRatio={gasRefundRatio} txData={data} />
            )}
            <MessageSection relatedEvmTxHash={relatedEvmTxHash} txData={data} />
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
