import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { BackButton } from "lib/components/button";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state/EmptyState";
import { useTxData } from "lib/services/txService";
import { getFirstQueryParam } from "lib/utils";

import { TxHeader, TxInfo } from "./components";
import { MessageSection } from "./components/MessageSection";

const TxDetails = () => {
  const router = useRouter();
  const hashParam = getFirstQueryParam(router.query.txHash);

  const { data: txData, isLoading } = useTxData(hashParam);

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
        <Flex mt="24px" py="48px" borderWidth="1px 0" borderColor="pebble.700">
          <EmptyState
            imageVariant="not-found"
            heading="Transaction does not exist"
            message="Please check your input or make sure you have selected the correct network."
          />
        </Flex>
      )}
    </PageContainer>
  );
};

export default TxDetails;
