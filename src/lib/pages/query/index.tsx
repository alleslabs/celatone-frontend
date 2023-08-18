import { Heading, Button, Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import {
  useInternalNavigate,
  useWasmConfig,
  useMobile,
} from "lib/app-provider";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import { useSchemaStore } from "lib/providers/store";
import { AmpTrackToQuery } from "lib/services/amplitude";
import type { ContractDetail } from "lib/services/contractService";
import type { ContractAddr } from "lib/types";
import {
  jsonPrettify,
  getFirstQueryParam,
  decode,
  jsonValidate,
} from "lib/utils";

import { QueryArea } from "./components/QueryArea";

const Query = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { getQuerySchema } = useSchemaStore();

  const [contractAddress, setContractAddress] = useState("" as ContractAddr);
  const [codeHash, setCodeHash] = useState("");
  const [codeId, setCodeId] = useState("");
  const [initialMsg, setInitialMsg] = useState("");
  const isMobile = useMobile();
  const schema = getQuerySchema(codeHash);

  const goToExecute = () => {
    navigate({
      pathname: "/execute",
      query: { ...(contractAddress && { contract: contractAddress }) },
    });
  };

  const onContractSelect = useCallback(
    (contract: ContractAddr) => {
      navigate({
        pathname: "/query",
        query: { ...(contract && { contract }) },
        options: { shallow: true },
      });
    },
    [navigate]
  );

  useEffect(() => {
    if (router.isReady) {
      const contractAddressParam = getFirstQueryParam(
        router.query.contract
      ) as ContractAddr;

      const msgParam = getFirstQueryParam(router.query.msg);
      let decodeMsg = decode(msgParam);
      if (decodeMsg && jsonValidate(decodeMsg) !== null) {
        onContractSelect(contractAddressParam);
        decodeMsg = "";
      }
      const jsonMsg = jsonPrettify(decodeMsg);

      setContractAddress(contractAddressParam);
      setInitialMsg(jsonMsg);

      AmpTrackToQuery(!!contractAddressParam, !!msgParam);
    }
  }, [router, onContractSelect]);

  return (
    <PageContainer>
      <Flex mt={1} mb={8} justify="space-between">
        <Heading as="h5" variant="h5">
          Query Contract
        </Heading>
        {!isMobile && (
          <Box>
            <Button
              variant="ghost-secondary"
              size="sm"
              p="unset"
              pl={2}
              onClick={goToExecute}
            >
              Go To Execute
              <CustomIcon name="chevron-right" boxSize={3} />
            </Button>
          </Box>
        )}
      </Flex>

      <ContractSelectSection
        mode="all-lists"
        contractAddress={contractAddress}
        onContractSelect={onContractSelect}
        successCallback={(data: ContractDetail) => {
          setCodeHash(data.codeHash);
          setCodeId(String(data.codeId));
        }}
      />

      <QueryArea
        contractAddress={contractAddress}
        schema={schema}
        initialMsg={initialMsg}
        codeId={codeId}
        codeHash={codeHash}
      />
    </PageContainer>
  );
});

export default Query;
