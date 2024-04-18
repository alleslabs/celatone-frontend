import { Flex, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { trackToExecute, trackToQuery } from "lib/amplitude";
import {
  useInternalNavigate,
  useMobile,
  useWasmConfig,
} from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";
import { UserDocsLink } from "lib/components/UserDocsLink";
import type { ContractDetail } from "lib/services/contractService";
import { ContractInteractionTabs } from "lib/types";
import type { BechAddr32, Coin } from "lib/types";
import { jsonPrettify, jsonValidate, libDecode } from "lib/utils";

import {
  ExecuteArea,
  InteractionTypeSwitch,
  InteractionWrapper,
  QueryArea,
} from "./components";
import type { InteractContractQueryParams } from "./types";
import { zInteractContractQueryParams } from "./types";

const INTERACT_CONTRACT_PATH_NAME = "/interact-contract";

const InteractContractBody = ({
  selectedType,
  contract,
  msg,
}: InteractContractQueryParams) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [contractAddress, setContractAddress] = useState("" as BechAddr32);
  const [initialMsg, setInitialMsg] = useState("");
  const [initialFunds, setInitialFunds] = useState<Coin[]>([]);
  const [codeId, setCodeId] = useState<number>();
  const [codeHash, setCodeHash] = useState<string>();

  // ------------------------------------------//
  // ----------------CALLBACKS-----------------//
  // ------------------------------------------//

  const handleSetSelectedType = useCallback(
    (newType: ContractInteractionTabs) =>
      navigate({
        pathname: INTERACT_CONTRACT_PATH_NAME,
        query: {
          selectedType: newType,
          ...(contract && { contract }),
        },
        options: {
          shallow: true,
        },
      }),
    [contract, navigate]
  );

  const onContractSelect = useCallback(
    (newContract: BechAddr32) => {
      navigate({
        pathname: INTERACT_CONTRACT_PATH_NAME,
        query: {
          selectedType,
          contract: newContract,
        },
        options: { shallow: true },
      });
    },
    [navigate, selectedType]
  );

  // ------------------------------------------//
  // ---------------SIDE EFFECTS---------------//
  // ------------------------------------------//
  useEffect(() => {
    if (isMobile && selectedType === ContractInteractionTabs.ExecuteContract)
      navigate({
        pathname: INTERACT_CONTRACT_PATH_NAME,
        query: {
          ...(contract && { contract }),
        },
        options: {
          shallow: true,
        },
      });
  }, [contract, isMobile, navigate, selectedType]);

  useEffect(() => {
    if (!msg) {
      setInitialMsg("");
      setInitialFunds([]);
    }

    const decodeMsg = libDecode(msg);
    if (decodeMsg && !jsonValidate(decodeMsg)) {
      const jsonMsg = JSON.parse(decodeMsg);
      if (!jsonMsg.msg) {
        setInitialMsg(jsonPrettify(JSON.stringify(jsonMsg)));
      } else {
        setInitialMsg(jsonPrettify(JSON.stringify(jsonMsg.msg)));
        setInitialFunds(jsonMsg.funds);
      }
    }
    setContractAddress(contract);
  }, [contract, msg]);

  return (
    <PageContainer>
      <Flex mt={1} mb={8} justify="space-between">
        <Flex align="center" justify="space-between" w="full">
          <Flex align="center" gap={4}>
            <Heading variant="h5" as="h5" alignSelf="flex-start">
              {isMobile ? "Query" : "Contract Interactions"}
            </Heading>
            {!isMobile && (
              <InteractionTypeSwitch
                currentTab={selectedType}
                onTabChange={handleSetSelectedType}
              />
            )}
          </Flex>
          <UserDocsLink isButton isDevTool href="cosmwasm/query-execute" />
        </Flex>
      </Flex>
      {selectedType === ContractInteractionTabs.ExecuteContract && (
        <ConnectWalletAlert
          subtitle="You need to connect your wallet to perform this action"
          mb={8}
        />
      )}
      <ContractSelectSection
        mode="all-lists"
        contractAddress={contract}
        onContractSelect={onContractSelect}
        successCallback={(data: ContractDetail) => {
          setCodeHash(data.codeHash);
          setCodeId(data.codeId);
        }}
      />
      <InteractionWrapper
        currentTab={selectedType}
        queryContent={
          <QueryArea
            contractAddress={contractAddress}
            initialMsg={initialMsg}
            codeId={codeId}
            codeHash={codeHash}
          />
        }
        executeContent={
          <ExecuteArea
            contractAddress={contractAddress}
            initialMsg={initialMsg}
            initialFunds={initialFunds}
            codeId={codeId}
            codeHash={codeHash}
          />
        }
      />
    </PageContainer>
  );
};

const InteractContract = () => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();

  const validated = zInteractContractQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success) {
      const { selectedType, contract, msg } = validated.data;
      if (selectedType === ContractInteractionTabs.QueryContract)
        trackToQuery(!!contract, !!msg);
      else trackToExecute(!!contract, !!msg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <>
      {!validated.success ? (
        <InvalidState title="Invalid interact contract query" />
      ) : (
        <InteractContractBody {...validated.data} />
      )}
    </>
  );
};

export default InteractContract;
