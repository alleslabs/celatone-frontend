import { Flex, Heading } from "@chakra-ui/react";
import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { trackToExecute, trackToQuery } from "lib/amplitude";
import {
  useInternalNavigate,
  useMobile,
  useWasmConfig,
} from "lib/app-provider";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { InvalidState } from "lib/components/state";
import { TypeSwitch } from "lib/components/TypeSwitch";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useSchemaStore } from "lib/providers/store";
import { useDerivedWasmVerifyInfo } from "lib/services/verification/wasm";
import type { BechAddr32, Coin } from "lib/types";
import { ContractInteractionTabs } from "lib/types";
import { jsonPrettify, jsonValidate, libDecode } from "lib/utils";

import { ExecuteArea, InteractionWrapper, QueryArea } from "./components";
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
  const { getSchemaByCodeHash } = useSchemaStore();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [contractAddress, setContractAddress] = useState("" as BechAddr32);
  const [initialMsg, setInitialMsg] = useState("");
  const [initialFunds, setInitialFunds] = useState<Coin[]>([]);
  const [codeId, setCodeId] = useState<number>();
  const [codeHash, setCodeHash] = useState<string>();

  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const { data: derivedWasmVerifyInfo } = useDerivedWasmVerifyInfo(
    codeId,
    codeHash
  );

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
    if (isMobile && selectedType === ContractInteractionTabs.Execute)
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
    setContractAddress(contract);
    setCodeId(undefined);
    setCodeHash(undefined);
  }, [contract]);

  useEffect(() => {
    if (!msg) {
      setInitialMsg("");
      setInitialFunds([]);
    } else {
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
    }
  }, [msg]);

  const verifiedSchema = derivedWasmVerifyInfo?.schema;
  const localSchema = codeHash ? getSchemaByCodeHash(codeHash) : undefined;
  return (
    <PageContainer>
      <CelatoneSeo pageName="Query / Execute contract" />
      <Flex align="center" justify="space-between" w="full" mt={1} mb={8}>
        <Heading variant="h5" as="h5" alignSelf="flex-start">
          {isMobile ? "Query" : "Contract interactions"}
        </Heading>
        <UserDocsLink isButton isDevTool href="cosmwasm/query-execute" />
      </Flex>
      <ContractSelectSection
        mode="all-lists"
        contractAddress={contract}
        onContractSelect={onContractSelect}
        successCallback={(data) => {
          setCodeId(data.contract.codeId);
          setCodeHash(data.contract.codeHash);
        }}
      />
      <Flex gap={4} align="center" mt={8} mb={4}>
        <Heading variant="h6" as="h6" minW={40} mr={2}>
          {capitalize(selectedType)} Message
        </Heading>
        {!isMobile && (
          <TypeSwitch
            tabs={Object.values(ContractInteractionTabs)}
            currentTab={selectedType}
            onTabChange={handleSetSelectedType}
          />
        )}
      </Flex>
      <InteractionWrapper
        currentTab={selectedType}
        queryContent={
          <QueryArea
            verifiedSchema={verifiedSchema}
            localSchema={localSchema}
            contractAddress={contractAddress}
            initialMsg={initialMsg}
            codeId={codeId}
            codeHash={codeHash}
          />
        }
        executeContent={
          <ExecuteArea
            verifiedSchema={verifiedSchema}
            localSchema={localSchema}
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
      if (selectedType === ContractInteractionTabs.Query)
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
