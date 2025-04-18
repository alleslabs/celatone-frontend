import type { BechAddr32, Coin } from "lib/types";

import { Flex, Heading } from "@chakra-ui/react";
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
import { ContractInteractionTabs } from "lib/types";
import { jsonPrettify, jsonValidate, libDecode } from "lib/utils";
import { capitalize } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import type { InteractContractQueryParams } from "./types";

import { ExecuteArea, InteractionWrapper, QueryArea } from "./components";
import { zInteractContractQueryParams } from "./types";

const INTERACT_CONTRACT_PATH_NAME = "/interact-contract";

const InteractContractBody = ({
  contract,
  msg,
  selectedType,
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
        options: {
          shallow: true,
        },
        pathname: INTERACT_CONTRACT_PATH_NAME,
        query: {
          selectedType: newType,
          ...(contract && { contract }),
        },
      }),
    [contract, navigate]
  );

  const onContractSelect = useCallback(
    (newContract: BechAddr32) => {
      navigate({
        options: { shallow: true },
        pathname: INTERACT_CONTRACT_PATH_NAME,
        query: {
          contract: newContract,
          selectedType,
        },
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
        options: {
          shallow: true,
        },
        pathname: INTERACT_CONTRACT_PATH_NAME,
        query: {
          ...(contract && { contract }),
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
      <Flex align="center" justify="space-between" mb={8} mt={1} w="full">
        <Heading alignSelf="flex-start" as="h5" variant="h5">
          {isMobile ? "Query" : "Contract interactions"}
        </Heading>
        <UserDocsLink href="cosmwasm/query-execute" isButton isDevTool />
      </Flex>
      <ContractSelectSection
        contractAddress={contract}
        mode="all-lists"
        successCallback={(data) => {
          setCodeId(data.contract.codeId);
          setCodeHash(data.contract.codeHash);
        }}
        onContractSelect={onContractSelect}
      />
      <Flex align="center" gap={4} mb={4} mt={8}>
        <Heading as="h6" minW={40} mr={2} variant="h6">
          {capitalize(selectedType)} Message
        </Heading>
        {!isMobile && (
          <TypeSwitch
            currentTab={selectedType}
            tabs={Object.values(ContractInteractionTabs)}
            onTabChange={handleSetSelectedType}
          />
        )}
      </Flex>
      <InteractionWrapper
        currentTab={selectedType}
        executeContent={
          <ExecuteArea
            codeHash={codeHash}
            codeId={codeId}
            contractAddress={contractAddress}
            initialFunds={initialFunds}
            initialMsg={initialMsg}
            localSchema={localSchema}
            verifiedSchema={verifiedSchema}
          />
        }
        queryContent={
          <QueryArea
            codeHash={codeHash}
            codeId={codeId}
            contractAddress={contractAddress}
            initialMsg={initialMsg}
            localSchema={localSchema}
            verifiedSchema={verifiedSchema}
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
      const { contract, msg, selectedType } = validated.data;
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
