import { ArrowBackIcon } from "@chakra-ui/icons";
import { Heading, Button, Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { useExecuteCmds } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import PageContainer from "lib/components/PageContainer";
import type { ContractAddr } from "lib/types";
import {
  getFirstQueryParam,
  decode,
  jsonPrettify,
  jsonValidate,
} from "lib/utils";

import { ExecuteArea } from "./components/ExecuteArea";

const Execute = () => {
  const router = useRouter();

  const [contractAddress, setContractAddress] = useState("" as ContractAddr);
  const [initialMsg, setInitialMsg] = useState("");

  const { isFetching, execCmds } = useExecuteCmds({
    contractAddress,
  });

  const goToQuery = () => {
    router.push({
      pathname: "/query",
      query: { ...(contractAddress && { contract: contractAddress }) },
    });
  };
  const onContractSelect = useCallback(
    (contract: ContractAddr) => {
      router.push(
        {
          pathname: "/execute",
          query: { ...(contract && { contract }) },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  useEffect(() => {
    (async () => {
      const contractAddressParam = getFirstQueryParam(
        router.query.contract
      ) as ContractAddr;

      let decodeMsg = decode(getFirstQueryParam(router.query.msg));
      if (decodeMsg && jsonValidate(decodeMsg) !== null) {
        onContractSelect(contractAddressParam);
        decodeMsg = "";
      }
      const jsonMsg = jsonPrettify(decodeMsg);

      setContractAddress(contractAddressParam);
      setInitialMsg(jsonMsg);
    })();
  }, [router, onContractSelect]);

  return (
    <PageContainer>
      {isFetching && <LoadingOverlay />}
      <Button
        variant="ghost-primary"
        onClick={() => router.back()}
        leftIcon={<ArrowBackIcon boxSize={4} />}
      >
        BACK
      </Button>
      <Flex mt={2} mb={8} justify="space-between">
        <Heading as="h5" variant="h5" color="text.main">
          Execute Contract
        </Heading>
        <Box>
          <Button variant="ghost-primary" size="sm" onClick={goToQuery}>
            Go To Query
          </Button>
        </Box>
      </Flex>
      <ConnectWalletAlert
        subtitle="You need to connect your wallet to perform this action"
        mb={8}
      />

      <ContractSelectSection
        contractAddress={contractAddress}
        onContractSelect={onContractSelect}
      />

      <ExecuteArea
        contractAddress={contractAddress}
        initialMsg={initialMsg}
        cmds={execCmds}
      />
    </PageContainer>
  );
};

export default Execute;
