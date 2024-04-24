import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import PageHeaderContainer from "lib/components/PageHeaderContainer";
import { EmptyState } from "lib/components/state/EmptyState";
import { useTxData } from "lib/services/txService";
import { getFirstQueryParam, truncate } from "lib/utils";

import { TxHeader, TxInfo, TxInfoMobile } from "./components";
import { MessageSection } from "./components/MessageSection";

const TxDetails = () => {
  const router = useRouter();
  const hashParam = getFirstQueryParam(router.query.txHash);
  const isMobile = useMobile();
  const {
    data: txData,
    isLoading: txLoading,
    isFetching: txFetching,
  } = useTxData(hashParam);

  useEffect(() => {
    if (router.isReady && !(txLoading && txFetching)) {
      const mapTxFailed = {
        true: "fail",
        false: "success",
        undefined: "not_found",
      };
      track(AmpEvent.TO_TRANSACTION_DETAILS, {
        tx_status:
          mapTxFailed[String(txData?.isTxFailed) as keyof typeof mapTxFailed],
      });
    }
  }, [router.isReady, txData, txLoading, txFetching]);

  if ((txLoading && txFetching) || !hashParam) return <Loading withBorder />;

  return (
    <>
      {txData ? (
        <>
          <PageHeaderContainer bgColor="overlay.transaction">
            <Flex direction="column" gap={2}>
              <Breadcrumb
                items={[
                  { text: "Transactions", href: "/txs" },
                  { text: truncate(txData?.txhash) },
                ]}
              />
              <TxHeader txData={txData} />
            </Flex>
          </PageHeaderContainer>
          <PageContainer>
            {isMobile && <TxInfoMobile txData={txData} />}
            <Flex mb={{ base: 0, md: 12 }} justify="space-between">
              {!isMobile && <TxInfo txData={txData} />}
              <MessageSection txData={txData} />
            </Flex>
          </PageContainer>
        </>
      ) : (
        <PageContainer>
          <EmptyState
            imageVariant="not-found"
            heading="Transaction does not exist"
            message="Please check your input or make sure you have selected the correct network."
          />
        </PageContainer>
      )}
    </>
  );
};

export default TxDetails;
