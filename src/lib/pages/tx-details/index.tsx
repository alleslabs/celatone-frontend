import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { EmptyState, InvalidState } from "lib/components/state";
import { useTxData } from "lib/services/tx";
import { truncate } from "lib/utils";

import { TxHeader, TxInfo, TxInfoMobile } from "./components";
import { MessageSection } from "./components/MessageSection";
import { zTxDetailsQueryParams } from "./types";

const InvalidTx = () => <InvalidState title="Transaction does not exist" />;

const TxDetailsBody = ({ txHash }: { txHash: string }) => {
  const router = useRouter();
  const isMobile = useMobile();
  const { data, isLoading } = useTxData(txHash);

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

  if (isLoading) return <Loading withBorder />;
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
    </>
  );
};

const TxDetails = () => {
  const router = useRouter();
  const validated = zTxDetailsQueryParams.safeParse(router.query);

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
