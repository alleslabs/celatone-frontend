import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, useTrack } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state/EmptyState";
import { useAssetInfos } from "lib/services/assetService";
import { useTxData } from "lib/services/txService";
import { getFirstQueryParam, truncate } from "lib/utils";

import { TxHeader, TxInfo, TxInfoMobile } from "./components";
import { MessageSection } from "./components/MessageSection";

const TxDetails = () => {
  const router = useRouter();
  const { track } = useTrack();
  const hashParam = getFirstQueryParam(router.query.txHash);
  const isMobile = useMobile();
  const {
    data: txData,
    isLoading: txLoading,
    isFetching: txFetching,
  } = useTxData(hashParam);
  const { assetInfos, isLoading: assetLoading } = useAssetInfos({
    withPrices: true,
  });

  useEffect(() => {
    if (router.isReady && !(txLoading && txFetching)) {
      const mapTxFailed = {
        true: "fail",
        false: "success",
        undefined: "not_found",
      };
      track(AmpEvent.TO_TRANSACTION_DETAIL, {
        tx_status:
          mapTxFailed[String(txData?.isTxFailed) as keyof typeof mapTxFailed],
      });
    }
  }, [router.isReady, txData, txLoading, txFetching, track]);

  if ((txLoading && txFetching) || assetLoading || !hashParam)
    return <Loading withBorder />;

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { text: "Transactions", href: "/txs" },
          { text: truncate(txData?.txhash) },
        ]}
      />
      {txData ? (
        <>
          <TxHeader mt={2} txData={txData} />
          {isMobile && <TxInfoMobile txData={txData} assetInfos={assetInfos} />}
          <Flex my={{ base: 0, md: 12 }} justify="space-between">
            {!isMobile && <TxInfo txData={txData} assetInfos={assetInfos} />}
            <MessageSection txData={txData} assetInfos={assetInfos} />
          </Flex>
        </>
      ) : (
        <EmptyState
          imageVariant="not-found"
          heading="Transaction does not exist"
          message="Please check your input or make sure you have selected the correct network."
        />
      )}
    </PageContainer>
  );
};

export default TxDetails;
