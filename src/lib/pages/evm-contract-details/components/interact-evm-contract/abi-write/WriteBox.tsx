import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  Button,
  Flex,
  Text,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

import { JsonFragment } from "ethers";
import { AmpEvent, track } from "lib/amplitude";
import { useRequestEvmTx } from "lib/app-provider";
import { EstimatedFeeEvmRender } from "lib/components/EstimatedFeeEvmRender";
import { EvmAbiForm } from "lib/components/evm-abi";
import { CustomIcon } from "lib/components/icon";
import { useTxBroadcast } from "lib/hooks";
import { useSimulateFeeEvmQuery } from "lib/services/tx";
import { SimulatedFeeEvm } from "lib/services/types";
import type { HexAddr20, JsonDataType } from "lib/types";
import { encodeEvmFunctionData } from "lib/utils";
import { isUndefined } from "lodash";
import { CopyButton } from "lib/components/copy";

const EvmCodeSnippet = dynamic(
  () => import("lib/components/modal/EvmCodeSnippet"),
  {
    ssr: false,
  }
);

interface WriteBoxProps {
  contractAddress: HexAddr20;
  abiSection: JsonFragment;
  opened: boolean;
}

export const WriteBox = ({
  contractAddress,
  abiSection,
  opened,
}: WriteBoxProps) => {
  // ------------------------------------------//
  // --------------DEPENDENCIES----------------//
  // ------------------------------------------//
  const requestEvmTx = useRequestEvmTx();
  const { broadcast } = useTxBroadcast();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const [fee, setFee] = useState<SimulatedFeeEvm>();
  const [inputs, setInputs] = useState<JsonDataType[]>([]);
  const [value, setValue] = useState("");
  const [simulateFeeError, setSimulateFeeError] = useState<string>();
  const [processing, setProcessing] = useState(false);

  // ------------------------------------------//
  // -------------------LOGICS-----------------//
  // ------------------------------------------//

  const data = useMemo(
    () => encodeEvmFunctionData(abiSection, inputs),
    [abiSection, inputs]
  );
  const enabledExecute = useMemo(
    () => opened && !isUndefined(data),
    [opened, data]
  );

  // ------------------------------------------//
  // -----------------REACT QUERY--------------//
  // ------------------------------------------//
  const { isFetching } = useSimulateFeeEvmQuery({
    enabled: enabledExecute,
    to: contractAddress,
    data: data ?? "",
    value,
    onSuccess: (gasRes) => {
      setSimulateFeeError(undefined);
      if (gasRes) setFee(gasRes);
      else setFee(undefined);
    },
    onError: (e) => {
      setSimulateFeeError(e.message);
      setFee(undefined);
    },
  });

  // ------------------------------------------//
  // ------------------CALLBACKS---------------//
  // ------------------------------------------//
  const handleChangeInputs = useCallback((formInputs: JsonDataType[]) => {
    setInputs(formInputs);

    // reset fee and error when user change the input
    setSimulateFeeError(undefined);
    setFee(undefined);
  }, []);
  const handleChangeValue = useCallback((formValue: string) => {
    setValue(formValue);

    // reset fee and error when user change the input
    setSimulateFeeError(undefined);
    setFee(undefined);
  }, []);

  const proceed = useCallback(async () => {
    track(AmpEvent.ACTION_EVM_WRITE);
    const stream = await requestEvmTx({
      to: contractAddress,
      data: data ?? "",
      value,
      onTxSucceed: () => setProcessing(false),
      onTxFailed: () => setProcessing(false),
      estimatedFee: fee,
    });
    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [broadcast, contractAddress, data, fee, requestEvmTx, value]);

  // ------------------------------------------//
  // ----------------SIDE EFFECTS--------------//
  // ------------------------------------------//

  useEffect(() => {
    if (data === undefined) setFee(undefined);
  }, [data]);

  return (
    <AccordionItem className={`abi_write_${abiSection.name}`}>
      <h6>
        <AccordionButton p={4} justifyContent="space-between">
          <Text variant="body1" fontWeight={700}>
            {abiSection.name}
          </Text>
          <AccordionIcon />
        </AccordionButton>
      </h6>
      <AccordionPanel mx={2}>
        <Flex direction="column" gap={6}>
          <EvmAbiForm
            types={abiSection.inputs ?? []}
            isPayable={abiSection.stateMutability === "payable"}
            propsOnChangeInputs={handleChangeInputs}
            propsOnChangeValue={handleChangeValue}
          />
          {simulateFeeError && (
            <Alert variant="error" alignItems="center">
              <AlertDescription wordBreak="break-word">
                {simulateFeeError}
              </AlertDescription>
            </Alert>
          )}
          <Flex align="center" justifyContent="space-between">
            <Flex gap={2} justify="flex-start">
              <CopyButton
                variant="outline-secondary"
                isDisable={isUndefined(data)}
                value={data ?? ""}
                amptrackSection="write_inputs"
                buttonText="Copy Encoded Inputs"
              />
              <EvmCodeSnippet />
            </Flex>
            <Flex direction="row" align="center" gap={2}>
              <Flex fontSize="14px" color="text.dark" alignItems="center">
                Transaction Fee:{" "}
                <EstimatedFeeEvmRender
                  gasPrice={fee?.gasPrice}
                  gasUsed={fee?.simulatedGasUsed}
                  loading={isFetching}
                />
              </Flex>
              <Button
                variant="primary"
                fontSize="14px"
                p="6px 16px"
                onClick={proceed}
                isDisabled={!enabledExecute || !fee || isFetching}
                leftIcon={<CustomIcon name="execute" />}
                isLoading={processing}
                sx={{ pointerEvents: processing && "none" }}
              >
                Execute
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};
