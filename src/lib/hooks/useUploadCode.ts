import type { StdFee } from "@cosmjs/amino";
import { useCallback, useMemo, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import type { StoreCodeSucceedCallback } from "lib/app-fns/tx/storeCode";
import {
  useCelatoneApp,
  useCurrentChain,
  useFabricateFee,
  useSimulateFeeForStoreCode,
  useStoreCodeTx,
  useValidateAddress,
} from "lib/app-provider";
import { useCodeStore } from "lib/providers/store";
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
    status: "default",
    message: "",
  });
  const { validateUserAddress, validateContractAddress } = useValidateAddress();
  const fabricateFee = useFabricateFee();

  const [formData, setFormData] = useState<UploadSectionState>({
    wasmFile: undefined,
    codeName: "",
    permission: AccessType.ACCESS_TYPE_EVERYBODY,
    addresses: [{ address: "" as BechAddr }],
  });

  const { wasmFile, codeName, permission, addresses } = formData;

  const setDefaultBehavior = useCallback(() => {
    setSimulateStatus({ status: "default", message: "" });
    setEstimatedFee(undefined);
  }, [setEstimatedFee]);

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
    enabled: Boolean(wasmFile && address && !shouldNotSimulate),
    wasmFile,
    permission,
    // Remarks: disableAnyOfAddresses is only used for Cosmos SDK 0.26
    addresses: disableAnyOfAddresses
      ? undefined
      : addresses.map((addr) => addr.address),
    onSuccess: (fee) => {
      if (wasmFile && address) {
        if (shouldNotSimulate) {
          setDefaultBehavior();
        }
        if (fee) {
          setSimulateStatus({
            status: "succeeded",
            message: "Valid Wasm file and instantiate permission",
          });
          setEstimatedFee(fabricateFee(fee));
        }
      }
    },
    onError: (e) => {
      if (shouldNotSimulate) {
        setDefaultBehavior();
      } else {
        setSimulateStatus({ status: "failed", message: e.message });
        setEstimatedFee(undefined);
      }
    },
  });

  const proceed = useCallback(async () => {
    if (address) {
      track(AmpEvent.ACTION_UPLOAD);
      const stream = await storeCodeTx({
        wasmFileName: wasmFile?.name,
        wasmCode: wasmFile?.arrayBuffer(),
        // Remarks: disableAnyOfAddresses is only used for Cosmos SDK 0.26
        addresses: disableAnyOfAddresses
          ? undefined
          : addresses.map((addr) => addr.address),
        permission,
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
    proceed,
    setFormData,
    estimatedFee,
    setEstimatedFee,
    shouldNotSimulate,
    setDefaultBehavior,
    simulateStatus,
    isSimulating,
    isDisabledProcess:
      isSimulating ||
      shouldNotSimulate ||
      simulateStatus.status !== "succeeded",
  };
};
