import { ArrowBackIcon } from "@chakra-ui/icons";
import { Heading, Button, Box, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useExecuteCmds, useInternalNavigate } from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import PageContainer from "lib/components/PageContainer";
import type { ContractAddr } from "lib/types";
import {
  getFirstQueryParam,
  decode,
  jsonPrettify,
  jsonValidate,
} from "lib/utils";

import { ExecuteArea } from "./components/ExecuteArea";
import type { ExecutePageState } from "./types";

const Execute = () => {
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { control, setValue, watch } = useForm<ExecutePageState>({
    mode: "all",
    defaultValues: {
      contractAddress: "",
      initialMsg: "",
      assets: [{ denom: "", amount: "" }],
    },
  });
  const watchContractAddress = watch("contractAddress");

  const { isFetching, execCmds } = useExecuteCmds(watchContractAddress);

  const goToQuery = () => {
    navigate({
      pathname: "/query",
      query: {
        ...(watchContractAddress && { contract: watchContractAddress }),
      },
    });
  };

  const onContractSelect = useCallback(
    (contract: ContractAddr) => {
      navigate({
        pathname: "/execute",
        query: { ...(contract && { contract }) },
        options: { shallow: true },
      });
    },
    [navigate]
  );

  useEffect(() => {
    (async () => {
      const contractAddressParam = getFirstQueryParam(
        router.query.contract
      ) as ContractAddr;

      let decodeMsg = decode(getFirstQueryParam(router.query.msg));
      if (decodeMsg && jsonValidate(decodeMsg) !== null) {
        onContractSelect(contractAddressParam);
        decodeMsg = "";
      }
      const jsonMsg = jsonPrettify(decodeMsg);

      setValue("contractAddress", contractAddressParam);
      setValue("initialMsg", jsonMsg);
    })();
  }, [router, onContractSelect, setValue]);

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
      <Flex mt={1} mb={8} justify="space-between">
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

      <ContractSelectSection
        mode="instantiator"
        contractAddress={watchContractAddress}
        onContractSelect={onContractSelect}
      />

      <ExecuteArea control={control} cmds={execCmds} setValue={setValue} />
    </PageContainer>
  );
};

export default Execute;
