import type { Coin } from "@cosmjs/stargate";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { trackToExecute } from "lib/amplitude";
import { useInternalNavigate, useWasmConfig } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ContractInteractionTabs } from "lib/components/ContractInteractionSwitch";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { ExecuteArea } from "lib/pages/contract-interaction/components/execute/ExecuteArea";
import type { ContractDetail } from "lib/services/contractService";
import type { BechAddr32 } from "lib/types";
import {
  getFirstQueryParam,
  jsonPrettify,
  jsonValidate,
  libDecode,
} from "lib/utils";

const ExecuteSection = () => {
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

  const onContractSelect = useCallback(
    (contract: BechAddr32) => {
      navigate({
        pathname: "/contract-interaction",
        query: {
          selectedType: ContractInteractionTabs.EXECUTE,
          ...(contract && { contract }),
        },
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
    <>
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
    </>
  );
};

export default ExecuteSection;
