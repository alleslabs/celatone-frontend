import { ChevronRightIcon } from "@chakra-ui/icons";
import { Heading, Button, Box, Flex } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { useInternalNavigate } from "lib/app-provider";
import { BackButton } from "lib/components/button";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import PageContainer from "lib/components/PageContainer";
import { useExecuteCmds } from "lib/hooks";
import { AmpTrackToExecute } from "lib/services/amplitude";
import type { ContractAddr } from "lib/types";
import {
  getFirstQueryParam,
  jsonPrettify,
  jsonValidate,
  libDecode,
} from "lib/utils";

import { ExecuteArea } from "./components/ExecuteArea";

const Execute = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const [initialMsg, setInitialMsg] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [initialFunds, setInitialFunds] = useState<Coin[]>([]);

  const { isFetching, execCmds } = useExecuteCmds(
    contractAddress as ContractAddr
  );

  const goToQuery = () => {
    navigate({
      pathname: "/query",
      query: {
        ...(contractAddress && { contract: contractAddress }),
      },
    });
  };

  const onContractSelect = useCallback(
    (contract: ContractAddr) => {
      navigate({
        pathname: "/execute",
        query: { ...(contract && { contract }) },
        options: { shallow: true },
      });
    },
    [navigate]
  );

  useEffect(() => {
    const msgParam = getFirstQueryParam(router.query.msg);
    if (router.isReady) {
      const contractAddressParam = getFirstQueryParam(
        router.query.contract
      ) as ContractAddr;

      if (!msgParam.length) {
        setInitialMsg("");
        setInitialFunds([]);
      }

      const decodeMsg = libDecode(msgParam);

      if (decodeMsg && !jsonValidate(decodeMsg)) {
        const jsonMsg = JSON.parse(decodeMsg);
        if (!jsonMsg.msg) {
          setInitialMsg(jsonPrettify(JSON.stringify(jsonMsg)));
        } else {
          setInitialMsg(jsonPrettify(JSON.stringify(jsonMsg.msg)));
          setInitialFunds(jsonMsg.funds);
        }
      }

      setContractAddress(contractAddressParam);
      AmpTrackToExecute(!!contractAddressParam, !!msgParam);
    }
  }, [router, onContractSelect]);

  return (
    <PageContainer>
      {isFetching && <LoadingOverlay />}
      <BackButton />
      <Flex mt={1} mb={8} justify="space-between">
        <Heading as="h4" variant="h4">
          Execute Contract
        </Heading>
        <Box>
          <Button
            variant="ghost-primary"
            size="sm"
            onClick={goToQuery}
            rightIcon={<ChevronRightIcon boxSize={4} />}
          >
            Go To Query
          </Button>
        </Box>
      </Flex>
      <ConnectWalletAlert
        subtitle="You need to connect your wallet to perform this action"
        mb={8}
      />
      <ContractSelectSection
        mode="all-lists"
        contractAddress={contractAddress as ContractAddr}
        onContractSelect={onContractSelect}
      />

      <ExecuteArea
        contractAddress={contractAddress as ContractAddr}
        initialMsg={initialMsg}
        initialFunds={initialFunds}
        cmds={execCmds}
      />
    </PageContainer>
  );
};

export default Execute;
