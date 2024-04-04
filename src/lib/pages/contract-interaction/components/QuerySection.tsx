import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { trackToQuery } from "lib/amplitude";
import { useInternalNavigate, useWasmConfig } from "lib/app-provider";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { QueryArea } from "lib/pages/query/components/QueryArea";
import type { ContractDetail } from "lib/services/contractService";
import type { BechAddr32 } from "lib/types";
import {
  getFirstQueryParam,
  jsonPrettify,
  jsonValidate,
  libDecode,
} from "lib/utils";

const QuerySection = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const navigate = useInternalNavigate();

  const [contractAddress, setContractAddress] = useState("" as BechAddr32);
  const [codeHash, setCodeHash] = useState("");
  const [codeId, setCodeId] = useState<number>();
  const [initialMsg, setInitialMsg] = useState("");

  const onContractSelect = useCallback(
    (contract: BechAddr32) => {
      navigate({
        pathname: "/contract-interaction",
        query: { ...(contract && { contract }), selectedType: "query" },
        options: { shallow: true },
      });
    },
    [navigate]
  );

  useEffect(() => {
    if (router.isReady) {
      const contractAddressParam = getFirstQueryParam(
        router.query.contract
      ) as BechAddr32;
      const msgParam = getFirstQueryParam(router.query.msg);
      if (!msgParam.length) {
        setInitialMsg("");
      }

      const decodeMsg = libDecode(msgParam);

      if (decodeMsg && !jsonValidate(decodeMsg)) {
        setInitialMsg(jsonPrettify(decodeMsg));
      }

      setContractAddress(contractAddressParam);
      trackToQuery(!!contractAddressParam, !!msgParam);
    }
  }, [router, onContractSelect]);

  return (
    <>
      <ContractSelectSection
        mode="all-lists"
        contractAddress={contractAddress}
        onContractSelect={onContractSelect}
        successCallback={(data: ContractDetail) => {
          setCodeHash(data.codeHash);
          setCodeId(data.codeId);
        }}
      />
      <QueryArea
        contractAddress={contractAddress}
        initialMsg={initialMsg}
        codeId={codeId}
        codeHash={codeHash}
      />
    </>
  );
});

export default QuerySection;
