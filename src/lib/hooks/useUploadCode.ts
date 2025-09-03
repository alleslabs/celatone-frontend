import type { StdFee } from "@cosmjs/amino";
import type { StoreCodeSucceedCallback } from "lib/app-fns/tx/storeCode";
import type {
  BechAddr,
  Option,
  SimulateStatus,
  UploadSectionState,
} from "lib/types";

import { AmpEvent, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useCurrentChain,
  useFabricateFee,
  useInitia,
  useStoreCodeTx,
  useValidateAddress,
} from "lib/app-provider";
import { useCodeStore } from "lib/providers/store";
import { useSimulateFeeForStoreCode } from "lib/services/tx";
import { AccessType } from "lib/types";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useQueryEvents } from "./useQueryEvents";
import { useTxBroadcast } from "./useTxBroadcast";

export const useUploadCode = (
  onComplete: Option<StoreCodeSucceedCallback>,
  isMigrate: boolean
) => {
  const { broadcast } = useTxBroadcast();
  const { updateCodeInfo } = useCodeStore();
  const storeCodeTx = useStoreCodeTx(isMigrate);
  const { address } = useCurrentChain();
  const isInitia = useInitia();
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

  const simulateFeeForStoreCodeQuery = useSimulateFeeForStoreCode({
    // Remarks: disableAnyOfAddresses is only used for Cosmos SDK 0.26
    addresses: disableAnyOfAddresses
      ? undefined
      : addresses.map((addr) => addr.address),
    enabled: Boolean(wasmFile && address && !shouldNotSimulate),
    permission: isInitia ? undefined : permission,
    wasmFile,
  });
  useQueryEvents(simulateFeeForStoreCodeQuery, {
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
  });
  const { isFetching: isSimulating } = simulateFeeForStoreCodeQuery;

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
        // Remarks: There's a bug when signing an Amino message including the permission field.
        // Therefore, we decided not to include the permission field when deploying through Scan.
        // To customize permissions, deploy via the CLI.
        // If permission is undefined, the default permission is set to 'everybody'.
        permission: isInitia ? undefined : permission,
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
    isInitia,
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
