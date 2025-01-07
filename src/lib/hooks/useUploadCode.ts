import type { StdFee } from "@cosmjs/amino";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { AmpEvent, track } from "lib/amplitude";
import type { StoreCodeSucceedCallback } from "lib/app-fns/tx/storeCode";
import {
  useCelatoneApp,
  useCurrentChain,
  useFabricateFee,
  useStoreCodeTx,
  useValidateAddress,
} from "lib/app-provider";
import { useCodeStore } from "lib/providers/store";
import { useSimulateFeeForStoreCode } from "lib/services/tx";
import { AccessType } from "lib/types";
import type {
  BechAddr,
  Option,
  SimulateStatus,
  UploadSectionState,
} from "lib/types";

import { useTxBroadcast } from "./useTxBroadcast";

export const useUploadCode = (
  onComplete: Option<StoreCodeSucceedCallback>,
  isMigrate: boolean
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const { broadcast } = useTxBroadcast();
  const { updateCodeInfo } = useCodeStore();
  const storeCodeTx = useStoreCodeTx(isMigrate);
  const { address } = useCurrentChain();
  const {
    chainConfig: {
      extra: { disableAnyOfAddresses },
    },
  } = useCelatoneApp();
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateStatus, setSimulateStatus] = useState<SimulateStatus>({
    message: "",
    status: "default",
  });
  const { validateContractAddress, validateUserAddress } = useValidateAddress();
  const fabricateFee = useFabricateFee();

  const setDefaultBehavior = useCallback(() => {
    setSimulateStatus({ message: "", status: "default" });
    setEstimatedFee(undefined);
  }, [setEstimatedFee]);

  const formData = useForm<UploadSectionState>({
    defaultValues: {
      addresses: [{ address: "" as BechAddr }],
      codeName: "",
      permission: AccessType.ACCESS_TYPE_EVERYBODY,
      wasmFile: undefined,
    },
    mode: "all",
  });

  const { addresses, codeName, permission, wasmFile } = formData.watch();

  // Should not simulate when permission is any of addresses and address input is not filled, invalid, or empty
  const shouldNotSimulate = useMemo(() => {
    if (permission !== AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES) {
      return false;
    }

    const isEmptyAddress = addresses.some(
      (addr) => addr.address.trim().length === 0
    );

    const isInvalidAddress = addresses.some(
      (addr) =>
        validateUserAddress(addr.address) &&
        validateContractAddress(addr.address)
    );

    return isEmptyAddress || isInvalidAddress;
  }, [
    addresses,
    permission,
    validateContractAddress,
    validateUserAddress,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(addresses),
  ]);

  const { isFetching: isSimulating } = useSimulateFeeForStoreCode({
    // Remarks: disableAnyOfAddresses is only used for Cosmos SDK 0.26
    addresses: disableAnyOfAddresses
      ? undefined
      : addresses.map((addr) => addr.address),
    enabled: Boolean(wasmFile && address && !shouldNotSimulate),
    onError: (e) => {
      if (shouldNotSimulate) {
        setDefaultBehavior();
      } else {
        setSimulateStatus({ message: e.message, status: "failed" });
        setEstimatedFee(undefined);
      }
    },
    onSuccess: (fee) => {
      if (wasmFile && address) {
        if (shouldNotSimulate) {
          setDefaultBehavior();
        }
        if (fee) {
          setSimulateStatus({
            message: "Valid Wasm file and instantiate permission",
            status: "succeeded",
          });
          setEstimatedFee(fabricateFee(fee));
        }
      }
    },
    permission,
    wasmFile,
  });

  const proceed = useCallback(async () => {
    if (address) {
      track(AmpEvent.ACTION_UPLOAD);
      const stream = await storeCodeTx({
        // Remarks: disableAnyOfAddresses is only used for Cosmos SDK 0.26
        addresses: disableAnyOfAddresses
          ? undefined
          : addresses.map((addr) => addr.address),
        codeName,
        estimatedFee,
        onTxSucceed: (txResult) => {
          onComplete?.(txResult);
          updateCodeInfo(
            Number(txResult.codeId),
            address,
            codeName || `${wasmFile?.name}(${txResult.codeId})`
          );
        },
        permission,
        wasmCode: wasmFile?.arrayBuffer(),
        wasmFileName: wasmFile?.name,
      });

      if (stream) broadcast(stream);
    }
  }, [
    address,
    storeCodeTx,
    wasmFile,
    addresses,
    permission,
    codeName,
    estimatedFee,
    broadcast,
    updateCodeInfo,
    onComplete,
    disableAnyOfAddresses,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(addresses),
  ]);

  return {
    estimatedFee,
    formData,
    isDisabledProcess:
      isSimulating ||
      shouldNotSimulate ||
      simulateStatus.status !== "succeeded",
    isSimulating,
    proceed,
    setDefaultBehavior,
    setEstimatedFee,
    shouldNotSimulate,
    simulateStatus,
  };
};
