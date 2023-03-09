import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { BackButton } from "lib/components/button";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state/EmptyState";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { useTxData } from "lib/services/txService";
import { getFirstQueryParam } from "lib/utils";

import { TxHeader, TxInfo } from "./components";
import { MessageSection } from "./components/MessageSection";

const TxDetails = () => {
  const router = useRouter();
  const hashParam = getFirstQueryParam(router.query.txHash);

  const { data: txData, isLoading } = useTxData(hashParam);

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_TRANSACTION_DETAIL);
  }, [router.isReady]);

  if (isLoading) return <Loading />;

  return (
    <PageContainer>
      <BackButton />
      {txData ? (
        <>
          <TxHeader mt={2} txData={txData} />
          <Flex my={12} justify="space-between">
            <TxInfo txData={txData} />
            <MessageSection txData={txData} />
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
