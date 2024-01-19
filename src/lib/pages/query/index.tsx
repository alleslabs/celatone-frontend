import { Heading, Button, Box, Flex } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { trackToQuery } from "lib/amplitude";
import {
  useInternalNavigate,
  useWasmConfig,
  useMobile,
} from "lib/app-provider";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { CustomIcon } from "lib/components/icon";
import PageContainer from "lib/components/PageContainer";
import type { ContractDetail } from "lib/services/contractService";
import type { BechAddr32 } from "lib/types";
import {
  jsonPrettify,
  getFirstQueryParam,
  jsonValidate,
  libDecode,
} from "lib/utils";

import { QueryArea } from "./components/QueryArea";

const Query = observer(() => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const navigate = useInternalNavigate();

  const [contractAddress, setContractAddress] = useState("" as BechAddr32);
  const [codeHash, setCodeHash] = useState("");
  const [codeId, setCodeId] = useState<number>();
  const [initialMsg, setInitialMsg] = useState("");
  const isMobile = useMobile();

  const goToExecute = () => {
    navigate({
      pathname: "/execute",
      query: { ...(contractAddress && { contract: contractAddress }) },
    });
  };

  const onContractSelect = useCallback(
    (contract: BechAddr32) => {
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
          setCodeId(data.codeId);
        }}
      />

      <QueryArea
        contractAddress={contractAddress}
        initialMsg={initialMsg}
        codeId={codeId}
        codeHash={codeHash}
      />
    </PageContainer>
  );
});

export default Query;
