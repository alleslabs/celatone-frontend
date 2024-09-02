import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { EmptyState } from "lib/components/state/EmptyState";
import { useEvmTxHashByCosmosTxHash, useTxData } from "lib/services/tx";
import { getFirstQueryParam, truncate } from "lib/utils";

import { TxHeader, TxInfo, TxInfoMobile } from "./components";
import { MessageSection } from "./components/MessageSection";

const TxDetails = () => {
  const router = useRouter();
  const hashParam = getFirstQueryParam(router.query.txHash);
  const isMobile = useMobile();
  const { data, isLoading } = useTxData(hashParam);
  const { data: relatedEvmTxHash, isFetching: isRelatedEvmTxFetching } =
    useEvmTxHashByCosmosTxHash(hashParam);

  useEffect(() => {
    if (router.isReady && !isLoading) {
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
  }, [router.isReady, data, isLoading]);

  if (!hashParam || isLoading || isRelatedEvmTxFetching)
    return <Loading withBorder />;

  return (
    <PageContainer>
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
          {isMobile && <TxInfoMobile txData={data} />}
          <Flex my={{ base: 0, md: 12 }} gap={4} justify="space-between">
            {!isMobile && <TxInfo txData={data} />}
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
    </PageContainer>
  );
};

export default TxDetails;
