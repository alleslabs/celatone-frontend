import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { useMobile } from "lib/app-provider";
import { BackButton } from "lib/components/button";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state/EmptyState";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { useAssetInfos } from "lib/services/assetService";
import { useTxData } from "lib/services/txService";
import { getFirstQueryParam } from "lib/utils";

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
  const { assetInfos, isLoading: assetLoading } = useAssetInfos();

  useEffect(() => {
    if (router.isReady && !(txLoading && txFetching)) {
      const mapTxFailed = {
        true: "fail",
        false: "success",
        undefined: "not_found",
      };
      AmpTrack(AmpEvent.TO_TRANSACTION_DETAIL, {
        tx_status:
          mapTxFailed[String(txData?.isTxFailed) as keyof typeof mapTxFailed],
      });
    }
  }, [router.isReady, txData, txLoading, txFetching]);

  if ((txLoading && txFetching) || assetLoading || !hashParam)
    return <Loading />;

  return (
    <PageContainer>
      {!isMobile && <BackButton />}
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
