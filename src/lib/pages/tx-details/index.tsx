import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { BackButton } from "lib/components/button";
import PageContainer from "lib/components/PageContainer";
import { useTxData } from "lib/services/txService";
import { getFirstQueryParam } from "lib/utils";

import { TxHeader, TxInfo } from "./components";
import { MessageSection } from "./components/MessageSection";

const TxDetails = () => {
  const router = useRouter();
  const hashParam = getFirstQueryParam(router.query.txHash);

  const { data: txData } = useTxData(hashParam);
  // console.log(txData);
  // Render Loading
  if (!txData) return null;

  return (
    <PageContainer>
      <BackButton />
      <TxHeader mt={2} txData={txData} />
      <Flex my={12} justify="space-between">
        <TxInfo txData={txData} />
        <MessageSection txData={txData} />
      </Flex>
    </PageContainer>
  );
};

export default TxDetails;
