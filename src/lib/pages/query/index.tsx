import { Heading, Button, Box, Flex } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { useInternalNavigate, useLCDEndpoint } from "lib/app-provider";
import { BackButton } from "lib/components/button";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { CustomIcon } from "lib/components/icon";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import PageContainer from "lib/components/PageContainer";
import { AmpTrackToQuery } from "lib/services/amplitude";
import { queryData } from "lib/services/contract";
import type { ContractAddr, RpcQueryError } from "lib/types";
import {
  jsonPrettify,
  getFirstQueryParam,
  decode,
  jsonValidate,
} from "lib/utils";

import { QueryArea } from "./components/QueryArea";

const Query = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const endpoint = useLCDEndpoint();

  const [contractAddress, setContractAddress] = useState("" as ContractAddr);
  const [initialMsg, setInitialMsg] = useState("");
  const [cmds, setCmds] = useState<[string, string][]>([]);

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

  // TODO: Abstract query and make query key
  const { isFetching } = useQuery(
    ["query", "cmds", endpoint, contractAddress, '{"": {}}'],
    async () => queryData(endpoint, contractAddress, '{"": {}}'),
    {
      enabled: !!contractAddress,
      retry: false,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      onError: (e: AxiosError<RpcQueryError>) => {
        const queryCmds: string[] = [];
        Array.from(e.response?.data.message?.matchAll(/`(.*?)`/g) || [])
          .slice(1)
          .forEach((match) => queryCmds.push(match[1]));
        setCmds(queryCmds.map((cmd) => [cmd, `{"${cmd}": {}}`]));
      },
    }
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
      if (!contractAddressParam) setCmds([]);

      AmpTrackToQuery(!!contractAddressParam, !!msgParam);
    }
  }, [router, onContractSelect]);

  return (
    <PageContainer>
      {isFetching && <LoadingOverlay />}
      <BackButton />
      <Flex mt={1} mb={8} justify="space-between">
        <Heading as="h5" variant="h5">
          Query Contract
        </Heading>
        <Box>
          <Button
            variant="ghost-primary"
            size="sm"
            p="unset"
            pl="2"
            onClick={goToExecute}
          >
            Go To Execute
            <CustomIcon name="chevron-right" color="lilac.main" boxSize="3" />
          </Button>
        </Box>
      </Flex>

      <ContractSelectSection
        mode="all-lists"
        contractAddress={contractAddress}
        onContractSelect={onContractSelect}
      />

      <QueryArea
        contractAddress={contractAddress}
        initialMsg={initialMsg}
        cmds={cmds}
      />
    </PageContainer>
  );
};

export default Query;
