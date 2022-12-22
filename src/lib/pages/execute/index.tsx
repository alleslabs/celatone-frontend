import { ArrowBackIcon } from "@chakra-ui/icons";
import { Heading, Button, Box, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { SelectContract } from "lib/components/modal/select-contract";
import PageContainer from "lib/components/PageContainer";
import { useContractStore, useEndpoint, useMobile } from "lib/hooks";
import { queryContract } from "lib/services/contract";
import {
  getFirstQueryParam,
  decode,
  jsonPrettify,
  jsonValidate,
} from "lib/utils";

import { ExecuteArea } from "./components/ExecuteArea";
import { useExecuteCmds } from "./hook/useExecuteCmds";

const Execute = () => {
  const router = useRouter();
  const isMobile = useMobile();
  const { getContractInfo } = useContractStore();

  const endpoint = useEndpoint();

  const [contractAddress, setContractAddress] = useState<string>("");
  const [contractName, setContractName] = useState<string>("");
  const [initialMsg, setInitialMsg] = useState<string>("");
  const [cmds, setCmds] = useState<[string, string][]>([]);

  const { isFetching, isEmptyContractAddress, execCmds } = useExecuteCmds({
    contractAddress,
  });

  const goToQuery = () => {
    router.push({
      pathname: "/query",
      query: { ...(contractAddress && { contract: contractAddress }) },
    });
  };
  const onContractSelect = useCallback(
    (contract: string) => {
      router.push(
        {
          pathname: "/execute",
          query: { ...(contract && { contract }) },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  useEffect(() => {
    if (isEmptyContractAddress) {
      setContractAddress("");
    }
    setCmds(execCmds);
  }, [isEmptyContractAddress, execCmds]);

  useEffect(() => {
    (async () => {
      const contractAddr = getFirstQueryParam(router.query.contract);
      const contractState = getContractInfo(contractAddr);
      let decodeMsg = decode(getFirstQueryParam(router.query.msg));
      if (decodeMsg && jsonValidate(decodeMsg) !== null) {
        onContractSelect(contractAddr);
        decodeMsg = "";
      }
      const jsonMsg = jsonPrettify(decodeMsg);

      if (!contractState) {
        try {
          const onChainDetail = await queryContract(endpoint, contractAddr);
          setContractName(onChainDetail.result?.label);
        } catch {
          setContractName("Invalid Contract");
        }
      } else {
        setContractName(contractState.name ?? contractState.label);
      }

      setContractAddress(contractAddr);
      setInitialMsg(jsonMsg);
      if (!contractAddr) setCmds([]);
    })();
  }, [router, endpoint, getContractInfo, onContractSelect]);

  const notSelected = contractAddress.length === 0;

  return (
    <PageContainer>
      {isFetching && <LoadingOverlay />}
      <Button
        variant="ghost-primary"
        onClick={() => router.back()}
        leftIcon={<ArrowBackIcon boxSize={4} />}
      >
        BACK
      </Button>
      <Flex mt={2} mb={8} justify="space-between">
        <Heading as="h5" variant="h5" color="text.main">
          Execute Contract
        </Heading>
        <Box>
          <Button variant="ghost-primary" size="sm" onClick={goToQuery}>
            Go To Query
          </Button>
        </Box>
      </Flex>
      <ConnectWalletAlert
        subtitle="You need to connect your wallet to perform this action"
        mb={8}
      />
      <Flex
        mb="32px"
        borderWidth="thin"
        borderColor="gray.800"
        p="16px"
        borderRadius="4px"
        fontSize="12px"
        justify="space-between"
        align="center"
      >
        <Flex gap="24px" width="80%">
          <Flex direction="column" width="60%">
            Contract Address
            {!notSelected ? (
              <ExplorerLink
                value={contractAddress}
                type="contract_address"
                canCopyWithHover
                // TODO - Revisit not necessary if disable UI for mobile is implemented
                textFormat={isMobile ? "truncate" : "normal"}
                maxWidth="none"
              />
            ) : (
              <Text textColor="text.disabled" variant="body2">
                Not Selected
              </Text>
            )}
          </Flex>
          <Flex direction="column">
            Contract Name
            <Text
              textColor={notSelected ? "text.disabled" : "text.dark"}
              variant="body2"
            >
              {notSelected ? "Not Selected" : contractName}
            </Text>
          </Flex>
        </Flex>
        <SelectContract
          notSelected={notSelected}
          onContractSelect={onContractSelect}
        />
      </Flex>

      <ExecuteArea
        contractAddress={contractAddress}
        initialMsg={initialMsg}
        cmds={cmds}
      />
    </PageContainer>
  );
};

export default Execute;
