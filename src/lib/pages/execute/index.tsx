import { Button, Flex, Heading } from "@chakra-ui/react";
import type { Coin } from "@cosmjs/stargate";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { trackToExecute } from "lib/amplitude";
import { useInternalNavigate, useWasmConfig } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { UserDocsLink } from "lib/components/UserDocsLink";
import type { ContractDetail } from "lib/services/contractService";
import type { BechAddr32 } from "lib/types";
import {
  getFirstQueryParam,
  jsonPrettify,
  jsonValidate,
  libDecode,
} from "lib/utils";

import { ExecuteArea } from "./components/ExecuteArea";

const Execute = () => {
  // ------------------------------------------//
  // --------------DEPENDENCIES----------------//
  // ------------------------------------------//
  useWasmConfig({ shouldRedirect: true });

  const router = useRouter();
  const navigate = useInternalNavigate();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [initialMsg, setInitialMsg] = useState("");
  const [contractAddress, setContractAddress] = useState("" as BechAddr32);
  const [initialFunds, setInitialFunds] = useState<Coin[]>([]);
  const [codeHash, setCodeHash] = useState("");
  const [codeId, setCodeId] = useState<number>();

  // ------------------------------------------//
  // ----------------CALLBACKS-----------------//
  // ------------------------------------------//
  const goToQuery = () => {
    navigate({
      pathname: "/query",
      query: {
        ...(contractAddress && { contract: contractAddress }),
      },
    });
  };

  const onContractSelect = useCallback(
    (contract: BechAddr32) => {
      navigate({
        pathname: "/execute",
        query: { ...(contract && { contract }) },
        options: { shallow: true },
      });
    },
    [navigate]
  );

  // ------------------------------------------//
  // ---------------SIDE EFFECTS---------------//
  // ------------------------------------------//
  useEffect(() => {
    if (router.isReady) {
      const contractAddressParam = getFirstQueryParam(
        router.query.contract
      ) as BechAddr32;
      const msgParam = getFirstQueryParam(router.query.msg);
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
      trackToExecute(!!contractAddressParam, !!msgParam);
    }
  }, [router, onContractSelect]);

  return (
    <PageContainer>
      <Flex mt={1} mb={8} justify="space-between">
        <Heading as="h5" variant="h5">
          Execute Contract
        </Heading>
        <Flex>
          <UserDocsLink
            isButton
            isSmall
            isDevTool
            href="cosmwasm/query-execute#execute"
          />
          <Button variant="ghost-primary" size="sm" ml={2} onClick={goToQuery}>
            Go To Query
            <CustomIcon name="chevron-right" boxSize={3} />
          </Button>
        </Flex>
      </Flex>
      <ConnectWalletAlert
        subtitle="You need to connect your wallet to perform this action"
        mb={8}
      />
      <ContractSelectSection
        mode="all-lists"
        contractAddress={contractAddress}
        onContractSelect={onContractSelect}
        successCallback={(data: ContractDetail) => {
          setCodeHash(data.codeHash);
          setCodeId(data.codeId);
        }}
      />

      <ExecuteArea
        contractAddress={contractAddress}
        initialMsg={initialMsg}
        initialFunds={initialFunds}
        codeId={codeId}
        codeHash={codeHash}
      />
    </PageContainer>
  );
};

export default Execute;
