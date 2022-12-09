import { ArrowBackIcon } from "@chakra-ui/icons";
import { Heading, Button, Box, Flex, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { useSimulateFeeQuery } from "lib/app-provider/queries";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { SelectContract } from "lib/components/modal/select-contract";
import PageContainer from "lib/components/PageContainer";
import {
  useContractStore,
  useEndpoint,
  useMobile,
  useUserKey,
} from "lib/hooks";
import { queryContract } from "lib/services/contract";
import type { ContractAddr, HumanAddr } from "lib/types";
import { MsgType } from "lib/types";
import {
  truncate,
  getFirstQueryParam,
  decode,
  jsonPrettify,
  jsonValidate,
  composeMsg,
} from "lib/utils";

import { ExecuteArea } from "./components/ExecuteArea";
import { LoadingOverlay } from "./components/LoadingOverlay";

const getAddrText = (contractAddress: string, isMobile: boolean) => {
  if (contractAddress.length === 0) return "Not Selected";
  if (isMobile) return truncate(contractAddress);
  return contractAddress;
};

const Execute = () => {
  const router = useRouter();
  const isMobile = useMobile();
  const { getContractInfo } = useContractStore();
  const { address = "" } = useWallet();
  const userKey = useUserKey();
  const endpoint = useEndpoint();

  const [contractAddress, setContractAddress] = useState<string>("");
  const [contractName, setContractName] = useState<string>("");
  const [initialMsg, setInitialMsg] = useState<string>("");
  const [cmds, setCmds] = useState<[string, string][]>([]);

  const goToQuery = () => {
    router.push({
      pathname: "/query",
      query: { ...(contractAddress && { contract: contractAddress }) },
    });
  };
  const onContractSelect = useCallback(
    (contract: string) => {
      router.replace(
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

  const { isFetching } = useSimulateFeeQuery({
    enabled: !!contractAddress,
    messages: [
      composeMsg(MsgType.EXECUTE, {
        sender: address as HumanAddr,
        contract: contractAddress as ContractAddr,
        msg: Buffer.from('{"": {}}'),
        funds: [],
      }),
    ],
    onError: (e) => {
      if (e.message.includes("contract: ")) {
        setContractAddress("");
        setCmds([]);
      } else {
        const queryCmds =
          e.message
            ?.match(
              "(?: expected one of )(.*)(?=: execute wasm contract failed: invalid request)"
            )
            ?.at(1)
            ?.split(", ") || [];

        setCmds(
          queryCmds.map((v) => {
            const cmd = v.slice(1, -1);
            return [cmd, `{"${cmd}": {}}`];
          })
        );
      }
    },
  });

  useEffect(() => {
    (async () => {
      const contract = getFirstQueryParam(router.query.contract);
      const contractState = getContractInfo(userKey, contract);
      let decodeMsg = decode(getFirstQueryParam(router.query.msg));
      if (decodeMsg && jsonValidate(decodeMsg) !== null) {
        onContractSelect(contract);
        decodeMsg = "";
      }
      const jsonMsg = jsonPrettify(decodeMsg);

      if (!contractState) {
        try {
          const onChainDetail = await queryContract(endpoint, contract);
          setContractName(onChainDetail.result?.label);
        } catch {
          setContractName("Invalid Contract");
        }
      } else {
        setContractName(contractState.name ?? contractState.label);
      }

      setContractAddress(contract);
      setInitialMsg(jsonMsg);
    })();
  }, [router, endpoint, userKey, getContractInfo, onContractSelect]);

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
        subtitle="You need to connect wallet to proceed this action"
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
        <Flex gap="24px">
          <Flex color="text.main" direction="column">
            Contract Address
            <Text
              mt={1}
              color={notSelected ? "gray.500" : "primary.main"}
              variant="body2"
            >
              {getAddrText(contractAddress, isMobile)}
            </Text>
          </Flex>
          <Flex color="text.main" direction="column">
            Contract Name
            <Text
              textColor={notSelected ? "text.disabled" : "text.dark"}
              mt={1}
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
