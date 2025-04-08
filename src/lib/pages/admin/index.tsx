import type { StdFee } from "@cosmjs/stargate";
import type { FormStatus } from "lib/components/forms";
import type { BechAddr, BechAddr32 } from "lib/types";

import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { AmpEvent, track, trackToAdminUpdate } from "lib/amplitude";
import {
  useCurrentChain,
  useFabricateFee,
  useGetAddressType,
  useInternalNavigate,
  useUpdateAdminTx,
  useValidateAddress,
  useWasmConfig,
} from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ContractInputSection } from "lib/components/ContractInputSection";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { ErrorMessageRender } from "lib/components/ErrorMessageRender";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { TextInput } from "lib/components/forms";
import { CelatoneSeo } from "lib/components/Seo";
import { TierSwitcher } from "lib/components/TierSwitcher";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useTxBroadcast } from "lib/hooks";
import { useSimulateFeeQuery } from "lib/services/tx";
import { useContractData } from "lib/services/wasm/contract";
import { MsgType } from "lib/types";
import { composeMsg } from "lib/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import type { UpdateAdminQueryParams } from "./types";

import { zUpdateAdminQueryParams } from "./types";

const UpdateAdminBody = ({ contractAddress }: UpdateAdminQueryParams) => {
  const router = useRouter();
  const { address } = useCurrentChain();
  const { validateContractAddress, validateUserAddress } = useValidateAddress();
  const getAddressType = useGetAddressType();
  const navigate = useInternalNavigate();
  const fabricateFee = useFabricateFee();
  const updateAdminTx = useUpdateAdminTx();
  const { broadcast } = useTxBroadcast();

  const [adminAddress, setAdminAddress] = useState("");
  const [adminFormStatus, setAdminFormStatus] = useState<FormStatus>({
    state: "init",
  });
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateError, setSimulateError] = useState<string>();

  const onContractPathChange = useCallback(
    (contract?: BechAddr32) => {
      navigate({
        pathname: "/admin",
        query: { ...(contract && { contract }) },
        options: { shallow: true },
      });
    },
    [navigate]
  );

  const { isFetching } = useSimulateFeeQuery({
    enabled:
      !!address && !!contractAddress && adminFormStatus.state === "success",
    messages: address
      ? [
          composeMsg(MsgType.UPDATE_ADMIN, {
            sender: address,
            newAdmin: adminAddress as BechAddr,
            contract: contractAddress,
          }),
        ]
      : [],
    onSuccess: (fee) => {
      if (fee) {
        setSimulateError(undefined);
        setEstimatedFee(fabricateFee(fee));
      } else setEstimatedFee(undefined);
    },
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
  });

  const proceed = useCallback(async () => {
    track(AmpEvent.ACTION_ADMIN_UPDATE);
    const stream = await updateAdminTx({
      contractAddress,
      newAdmin: adminAddress as BechAddr,
      estimatedFee,
    });

    if (stream) broadcast(stream);
  }, [adminAddress, contractAddress, updateAdminTx, broadcast, estimatedFee]);

  /**
   * @remarks Contract admin validation
   */
  useContractData(contractAddress, {
    onSuccess: (data) => {
      if (data.contract.admin !== address) onContractPathChange();
    },
    onError: () => onContractPathChange(),
  });

  useEffect(() => {
    if (contractAddress && validateContractAddress(contractAddress)) {
      onContractPathChange();
    }
  }, [contractAddress, onContractPathChange, validateContractAddress]);

  /**
   * @remarks Reset states on update admin succeed modal close
   */
  useEffect(() => {
    setAdminAddress("");
    setAdminFormStatus({
      state: "init",
    });
    setEstimatedFee(undefined);
    setSimulateError(undefined);
  }, [router.asPath]);

  /**
   * @remarks Admin address input validation
   */
  useEffect(() => {
    if (!adminAddress) setAdminFormStatus({ state: "init" });
    else {
      const addressType = getAddressType(adminAddress);
      if (addressType === "invalid_address") {
        setAdminFormStatus({
          state: "error",
          message: "Invalid address length",
        });
      } else {
        const validateResult =
          addressType === "user_address"
            ? validateUserAddress(adminAddress)
            : validateContractAddress(adminAddress);
        if (validateResult) {
          setAdminFormStatus({ state: "error", message: validateResult });
        } else {
          setAdminFormStatus({ state: "success" });
        }
      }
    }
  }, [
    adminAddress,
    getAddressType,
    validateContractAddress,
    validateUserAddress,
  ]);

  useEffect(() => {
    if (router.isReady) trackToAdminUpdate(!!contractAddress);
  }, [contractAddress, router.isReady]);

  return (
    <ActionPageContainer>
      <CelatoneSeo pageName="Update admin" />
      <Flex alignItems="center" direction="column" mb={6}>
        <Heading as="h5" variant="h5">
          Update admin
        </Heading>
        <UserDocsLink
          cta="View update admin guideline"
          href="cosmwasm/contracts/admin-actions#update-new-admin-to-the-contract"
          isDevTool
          isDevTool
          mt={2}
          mt={2}
        />
      </Flex>
      <ConnectWalletAlert
        mb={6}
        subtitle="You need to connect your wallet to perform this action"
      />
      <TierSwitcher
        full={
          <ContractSelectSection
            contractAddress={contractAddress}
            mode="only-admin"
            onContractSelect={(contract) => onContractPathChange(contract)}
          />
        }
        lite={
          <Box mb={12} w="full">
            <ContractInputSection
              contract={contractAddress}
              onContractSelect={(contract) => onContractPathChange(contract)}
            />
          </Box>
        }
      />
      <TextInput
        helperText="This address will be an admin for the deployed smart contract."
        label="New admin address"
        label="New Admin Address"
        setInputState={setAdminAddress}
        status={adminFormStatus}
        value={adminAddress}
        variant="fixed-floating"
        variant="fixed-floating"
      />
      <Flex
        alignItems="center"
        alignSelf="flex-start"
        color="text.dark"
        fontSize="14px"
        gap={1}
        mt={12}
      >
        <p>Transaction fee:</p>
        <EstimatedFeeRender estimatedFee={estimatedFee} loading={isFetching} />
      </Flex>
      {simulateError && (
        <ErrorMessageRender
          alignSelf="flex-start"
          error={simulateError}
          mt={4}
        />
      )}
      <Button
        isDisabled={!estimatedFee || isFetching}
        mt={12}
        onClick={proceed}
      >
        Update admin
      </Button>
    </ActionPageContainer>
  );
};

const UpdateAdmin = () => {
  useWasmConfig({ shouldRedirect: true });
  const router = useRouter();
  const validated = zUpdateAdminQueryParams.safeParse(router.query);
  return <>{validated.success && <UpdateAdminBody {...validated.data} />}</>;
};

export default UpdateAdmin;
