import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useMobile, useTierConfig } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state/EmptyState";
import { useTxData, useTxDataLcd } from "lib/services/wasm/txs";
import { getFirstQueryParam, truncate } from "lib/utils";

import { TxHeader, TxInfo, TxInfoMobile } from "./components";
import { MessageSection } from "./components/MessageSection";

const TxDetails = () => {
  const router = useRouter();
  const hashParam = getFirstQueryParam(router.query.txHash);
  const isMobile = useMobile();
  const tier = useTierConfig();

  const txData = useTxData(hashParam, tier === "full");
  const txDataLcd = useTxDataLcd(hashParam, tier === "lite");

  const { data, isLoading, isFetched } = tier === "full" ? txData : txDataLcd;

  useEffect(() => {
    if (router.isReady && !(isLoading && isFetched)) {
      const mapTxFailed = {
        true: "fail",
        false: "success",
        undefined: "not_found",
      };
      track(AmpEvent.TO_TRANSACTION_DETAILS, {
        tx_status:
          mapTxFailed[String(data?.isTxFailed) as keyof typeof mapTxFailed],
      });
    }
  }, [router.isReady, data, isLoading, isFetched]);

  if ((isLoading && isFetched) || !hashParam) return <Loading withBorder />;

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { text: "Transactions", href: "/txs" },
          { text: truncate(data?.txhash) },
        ]}
      />
      {data ? (
        <>
          <TxHeader mt={2} txData={data} />
          {isMobile && <TxInfoMobile txData={data} />}
          <Flex my={{ base: 0, md: 12 }} justify="space-between">
            {!isMobile && <TxInfo txData={data} />}
            <MessageSection txData={data} />
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
